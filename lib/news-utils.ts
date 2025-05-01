/**
 * Utility functions for fetching and processing news articles
 */

export interface NewsArticle {
  id: string;
  title: string;
  date: string;
  source: string;
  summary: string;
  url: string;
}

interface RawNewsArticle {
  headline: string;
  datetime: string;
  domain: string;
  url: string;
}

// Common news source domains
export const newsDomains = [
  "http://publico.pt/",
  "http://www.rtp.pt/",
  "http://expresso.pt/",
  "http://observador.pt/",
  "http://jornaldenegocios.pt/",
  "http://dn.pt/",
  "http://dn.sapo.pt/",
  "http://www.dn.pt/",
  "http://news.google.pt/",
  "http://dgo.pt/",
  "http://dgo.gov.pt/",
  "http://www.dgo.pt/",
  "http://www.portugal.gov.pt/",
  "https://www.dnoticias.pt/",
  "https://dnoticias.pt/",
  "https://www.jn.pt/",
  "https://jn.sapo.pt/",
  "https://sicnoticias.pt/",
  "https://www.rtp.pt/noticias/",
  "https://tvi24.iol.pt/",
  "https://www.sabado.pt/",
  "https://www.banca-financas.com/",
  "https://jornaleconomico.sapo.pt/"
];

/**
 * Fetches news articles from the arquivo API based on provided queries and filters
 * 
 * @param queries - Search queries to use
 * @param fromDate - Start date in format YYYY-MM-DD
 * @param toDate - End date in format YYYY-MM-DD
 * @param domains - Domains to search in
 * @param silent - If true, suppress error logging
 * @returns Array of raw news articles
 */
export async function fetchNewsArticles(
  queries: string[],
  fromDate: string,
  toDate: string,
  domains: string[] = newsDomains,
  silent: boolean = false,
  limit: number = 100
): Promise<RawNewsArticle[]> {
  // Collect all articles from different queries
  const allArticles: RawNewsArticle[] = [];
  
  // Execute all queries in parallel
  await Promise.all(
    queries.map(async (query) => {
      // Build URL with query parameters
      const params = new URLSearchParams();
      params.append("query", query);
      params.append("from", fromDate);
      params.append("to", toDate);
      params.append("limit", limit.toString());
      domains.forEach((domain) => params.append("domain", domain));
      
      try {
        const response = await fetch(`/api/arquivo?${params.toString()}`);
        
        if (!response.ok) {
          if (!silent) {
            console.error(`Failed to fetch news for query "${query}"`);
          }
          return;
        }
        
        const data = await response.json();
        
        // Add results to allArticles
        if (data.results && Array.isArray(data.results)) {
          allArticles.push(...data.results);
        }
      } catch (err) {
        if (!silent) {
          console.error(`Error fetching news for query "${query}":`, err);
        }
      }
    })
  );
  
  return allArticles;
}

/**
 * Removes duplicate articles based on title
 * 
 * @param articles - Raw news articles
 * @returns Filtered array with no duplicates
 */
export function removeDuplicateArticles(articles: RawNewsArticle[]): RawNewsArticle[] {
  const seenTitles = new Set<string>();
  return articles.filter((item) => {
    const normalizedTitle = item.headline?.trim().toLowerCase();
    const isNew = normalizedTitle && !seenTitles.has(normalizedTitle);
    if (isNew) seenTitles.add(normalizedTitle);
    return isNew;
  });
}

/**
 * Groups articles by their source domain
 * 
 * @param articles - Raw news articles
 * @returns Object with domains as keys and arrays of articles as values
 */
export function groupArticlesBySource(articles: RawNewsArticle[]): Record<string, RawNewsArticle[]> {
  const groupedBySource: Record<string, RawNewsArticle[]> = {};
  
  for (const item of articles) {
    const source = item.domain.replace("www.", "");
    if (!groupedBySource[source]) {
      groupedBySource[source] = [];
    }
    groupedBySource[source].push(item);
  }
  
  return groupedBySource;
}

/**
 * Interleaves articles from different sources in a round-robin fashion
 * 
 * @param groupedArticles - Articles grouped by source
 * @returns Flat array of interleaved articles
 */
export function interleaveArticlesBySource(groupedArticles: Record<string, RawNewsArticle[]>): RawNewsArticle[] {
  const interleaved: RawNewsArticle[] = [];
  let exhausted = false;
  
  while (!exhausted) {
    exhausted = true;
    for (const domain in groupedArticles) {
      if (groupedArticles[domain].length > 0) {
        interleaved.push(groupedArticles[domain].shift()!);
        exhausted = false;
      }
    }
  }
  
  return interleaved;
}

/**
 * Filters out articles that mention years other than the target year
 * 
 * @param articles - Raw news articles
 * @param targetYear - Year to match
 * @returns Filtered articles
 */
export function filterArticlesByYearMention(articles: RawNewsArticle[], targetYear: string): RawNewsArticle[] {
    const yearRegex = /\b(19|20)\d{2}\b/g;
    return articles.filter(article => {
      const headline = article.headline?.toLowerCase() || "";
      const mentionedYears = [...headline.matchAll(yearRegex)].map(match => match[0]);
      return mentionedYears.every(year => year === targetYear);
    });
}

/**
 * Sort articles by relevance based on headline quality
 * 
 * @param articles - Raw news articles
 * @param keywords - Optional keywords to prioritize
 * @returns Sorted articles array
 */
export function sortArticlesByRelevance(
    articles: RawNewsArticle[], 
    keywords?: string[],
    specialWord?: string
  ): RawNewsArticle[] {
    function computeScore(article: RawNewsArticle): number {
      const headline = article.headline?.trim() || "";
      const wordCount = headline.split(/\s+/).filter(Boolean).length;
      let score = 0;
  
      // +5 points if headline has more than 4 words
      if (wordCount > 4) score += 5;
  
      // +3 points per keyword match
      if (keywords && keywords.length > 0) {
        const matches = keywords.filter(keyword =>
          headline.toLowerCase().includes(keyword.toLowerCase())
        ).length;
        score += matches * 3;
      }
  
      // +10 points if special word is present
      if (specialWord && headline.toLowerCase().includes(specialWord.toLowerCase())) {
        score += 10;
      }
  
      // +0.5 per word to slightly favor longer headlines
      score += wordCount * 0.5;
  
      return score;
    }
  
    return [...articles].sort((a, b) => computeScore(b) - computeScore(a));
  }

/**
 * Filter out articles with invalid or empty headlines
 * 
 * @param articles - Raw news articles
 * @returns Filtered articles
 */
export function filterValidArticles(articles: RawNewsArticle[]): RawNewsArticle[] {
  return articles.filter((item) => item.headline && item.headline.trim() !== "");
}

/**
 * Format raw articles into NewsArticle interface format
 * 
 * @param articles - Raw news articles
 * @param idPrefix - Prefix for the ID field
 * @param limit - Maximum number of articles to return
 * @returns Formatted NewsArticle objects
 */
export function formatNewsArticles(
  articles: RawNewsArticle[], 
  idPrefix: string = "",
  limit: number = 10
): NewsArticle[] {
  return articles.slice(0, limit).map((item, index) => ({
    id: `${idPrefix}-${index}`,
    title: item.headline,
    date: new Date(item.datetime).toISOString().split("T")[0],
    source: item.domain.replace("www.", ""),
    summary: "",
    url: item.url
  }));
}

/**
 * Process news articles through the full pipeline
 * 
 * @param rawArticles - Raw articles from API
 * @param options - Processing options
 * @returns Processed and formatted NewsArticle objects
 */
export function processNewsArticles(
    rawArticles: RawNewsArticle[], 
    options: {
      keywords?: string[],
      idPrefix?: string,
      limit?: number,
      sortByRelevance?: boolean, 
      specialWord?: string,
      fromDate?: string // add this to infer the year
    } = {}
  ): NewsArticle[] {
    const {
      keywords = [],
      idPrefix = "",
      limit = 10,
      sortByRelevance = true,
      specialWord = "",
      fromDate = ""
    } = options;
  
    let processed = removeDuplicateArticles(rawArticles);
    processed = filterValidArticles(processed);
  
    // Optional: filter based on mentioned years
    if (fromDate) {
      const targetYear = fromDate.split("-")[0]; // e.g., "2017"
      processed = filterArticlesByYearMention(processed, targetYear);
    }
  
    const grouped = groupArticlesBySource(processed);
    if (sortByRelevance) {
      Object.keys(grouped).forEach(source => {
        grouped[source] = sortArticlesByRelevance(grouped[source], keywords, specialWord);
      });
    }
  
    const interleaved = interleaveArticlesBySource(grouped);
    return formatNewsArticles(interleaved, idPrefix, limit);
  }
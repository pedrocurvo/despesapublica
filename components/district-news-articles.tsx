"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface DistrictNewsArticlesProps {
  year: string
  district: string | null
}

interface NewsArticle {
  id: string
  title: string
  date: string
  source: string
  summary: string
  url: string
}

export function DistrictNewsArticles({ year, district }: DistrictNewsArticlesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't fetch if no district is selected
    if (!district) {
      setArticles([]);
      return;
    }

    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Calculate date range (January to December of the year)
        const fromDate = `${year}-01-01`
        const toDate = `${year}-12-31`
        
        // Normalize district names for Madeira and Açores
        let searchDistrict = district;
        if (district === "MADEIRA") {
          searchDistrict = "Madeira";
        } else if (district === "AÇORES") {
          searchDistrict = "Açores";
        }
        
        // Domains to search
        const domains = [
          "http://publico.pt/",
          "http://www.rtp.pt/",
          "http://expresso.pt/",
          "http://observador.pt/",
          "http://jornaldenegocios.pt/",
          "http://dn.pt/",
          'http://www.dn.pt/',
          'http://news.google.pt/',
          'http://dgo.pt/',
          'http://dgo.gov.pt/',
          'http://www.dgo.pt/',
          'http://www.portugal.gov.pt/',
        ]

        // Search queries using the district name
        const queries = [
          `orçamento ${searchDistrict} ${year}`,
          `investimento ${searchDistrict} ${year}`,
          `financiamento ${searchDistrict} ${year}`,
          `transferências ${searchDistrict} ${year}`
        ]
        
        // Collect all articles from different queries
        const allArticles: any[] = []
        
        // Execute all queries in parallel
        await Promise.all(queries.map(async (query) => {
          // Build URL with query parameters
          const params = new URLSearchParams()
          params.append("query", query)
          params.append("from", fromDate)
          params.append("to", toDate)
          domains.forEach(domain => params.append("domain", domain))
          
          try {
            const response = await fetch(`/api/arquivo?${params.toString()}`)
            
            if (!response.ok) {
              console.error(`Failed to fetch news for query "${query}"`)
              return
            }
            
            const data = await response.json()
            
            // Add results to allArticles
            if (data.results && Array.isArray(data.results)) {
              allArticles.push(...data.results)
            }
          } catch (err) {
            console.error(`Error fetching news for query "${query}":`, err)
          }
        }))
        
        // Remove duplicates by title
        const seenTitles = new Set<string>()
        const uniqueArticles = allArticles.filter((item) => {
          const normalizedTitle = item.headline?.trim().toLowerCase()
          const isNew = normalizedTitle && !seenTitles.has(normalizedTitle)
          if (isNew) seenTitles.add(normalizedTitle)
          return isNew
        })
        
        // Group by source domain
        const groupedBySource: Record<string, any[]> = {}
        for (const item of uniqueArticles) {
          const source = item.domain.replace("www.", "")
          if (!groupedBySource[source]) {
            groupedBySource[source] = []
          }
          groupedBySource[source].push(item)
        }

        // Filter and sort articles by preference:
        // 1. Prefer headlines with more than 4 words
        // 2. Prefer headlines that contain the district name
        const sortArticlesByRelevance = (articles: any[]) => {
          const normalizedDistrictName = searchDistrict.toLowerCase();
          
          return articles.sort((a, b) => {
            const headlineA = a.headline?.trim() || "";
            const headlineB = b.headline?.trim() || "";
            
            const wordsA = headlineA.split(/\s+/).filter(Boolean).length;
            const wordsB = headlineB.split(/\s+/).filter(Boolean).length;
            
            const containsDistrictA = headlineA.toLowerCase().includes(normalizedDistrictName);
            const containsDistrictB = headlineB.toLowerCase().includes(normalizedDistrictName);
            
            // First priority: Contains district name
            if (containsDistrictA && !containsDistrictB) return -1;
            if (!containsDistrictA && containsDistrictB) return 1;
            
            // Second priority: More than 4 words
            if (wordsA > 4 && wordsB <= 4) return -1;
            if (wordsA <= 4 && wordsB > 4) return 1;

            // Third priority: Contain oracamento/despesa related words
            const keywordsA = headlineA.toLowerCase().match(/(orçamento|despesa|investimento|financiamento|transferências)/g) || [];
            const keywordsB = headlineB.toLowerCase().match(/(orçamento|despesa|investimento|financiamento|transferências)/g) || [];
            const keywordCountA = keywordsA.length;
            const keywordCountB = keywordsB.length;
            if (keywordCountA > keywordCountB) return -1;
            if (keywordCountA < keywordCountB) return 1;
            
            // If both have same priority, prefer the one with more words
            return wordsB - wordsA;
          });
        };
        
        // Sort the articles within each source by relevance
        Object.keys(groupedBySource).forEach(source => {
          groupedBySource[source] = sortArticlesByRelevance(groupedBySource[source]);
        });

        // Interleave in round-robin
        const interleaved: any[] = []
        let exhausted = false
        while (!exhausted) {
          exhausted = true
          for (const domain in groupedBySource) {
            if (groupedBySource[domain].length > 0) {
              interleaved.push(groupedBySource[domain].shift())
              exhausted = false
            }
          }
        }

        // Format and limit
        const processedArticles = interleaved
          .filter((item: any) => {
            // Only include headlines that exist and are not empty
            const hasHeadline = item.headline && item.headline.trim() !== "";
            // Count words in headline
            const wordCount = hasHeadline ? item.headline.trim().split(/\s+/).filter(Boolean).length : 0;
            // Prefer headlines with more than 4 words
            return hasHeadline && wordCount > 0;
          })
          .slice(0, 10)
          .map((item: any, index: number) => ({
            id: `${year}-${district}-${index}`,
            title: item.headline,
            date: new Date(item.datetime).toISOString().split("T")[0],
            source: item.domain.replace("www.", ""),
            summary: "",
            url: item.url
          }))
        
        setArticles(processedArticles)
      } catch (err) {
        console.error("Error fetching news articles:", err)
        setError("Failed to load news articles. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchNews()
  }, [year, district])
  
  if (!district) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  // Format district name for display
  const formatDistrictName = (name: string) => {
    if (name === "AÇORES") return "Açores";
    if (name === "MADEIRA") return "Madeira";
    return name;
  };

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <div key={article.id} className="border-b pb-5 last:border-0">
          <h3 className="text-lg font-medium">{article.title}</h3>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{article.date}</span>
            <span className="mx-2">•</span>
            <span>{article.source}</span>
          </div>
          {article.summary && (
            <p className="mt-3 text-muted-foreground">{article.summary}</p>
          )}
          <div className="mt-3">
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline">
              Ler artigo completo
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
      {articles.length === 0 && !loading && (
        <div className="py-10 text-center text-muted-foreground">
          Não há artigos de notícias disponíveis para {formatDistrictName(district)} em {year}
        </div>
      )}
    </div>
  )
}
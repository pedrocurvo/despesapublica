"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SectorNewsArticlesProps {
  year: string
  sector: string | null
}

interface NewsArticle {
  id: string
  title: string
  date: string
  source: string
  summary: string
  url: string
}

export function SectorNewsArticles({ year, sector }: SectorNewsArticlesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Don't fetch if no sector is selected
    if (!sector) {
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
        
        // Domains to search
        const domains = [
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

        // Search queries using the sector name
        const queries = [
          `orçamento ${sector} ${year}`,
          `despesa ${sector} ${year}`,
          `${sector} orçamento estado ${year}`
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
            
            // Silently skip failed queries without logging errors
            if (!response.ok) {
              return
            }
            
            const data = await response.json()
            
            // Add results to allArticles
            if (data.results && Array.isArray(data.results)) {
              allArticles.push(...data.results)
            }
          } catch (err) {
            // Silently ignore fetch errors
          }
        }))
        
        // Remove duplicates by title + url
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

        // Filter articles with valid headlines
        const validArticles = interleaved.filter((item: any) => 
          item.headline && item.headline.trim() !== ""
        )

        // Separate articles into two groups: those with > 4 words and those with <= 4 words
        const longHeadlines: any[] = []
        const shortHeadlines: any[] = []
        
        validArticles.forEach((item: any) => {
          const wordCount = item.headline.trim().split(/\s+/).length
          if (wordCount > 4) {
            longHeadlines.push(item)
          } else {
            shortHeadlines.push(item)
          }
        })

        // Prioritize articles with longer headlines, but include shorter ones if needed
        const prioritizedArticles = [...longHeadlines, ...shortHeadlines].slice(0, 10)
        
        // Format and map the final list
        const processedArticles = prioritizedArticles.map((item: any, index: number) => ({
          id: `${year}-${sector}-${index}`,
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
  }, [year, sector])
  
  if (!sector) {
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
        <div className="py-10 text-center text-muted-foreground">Não há artigos de notícias disponíveis para o setor {sector} em {year}</div>
      )}
    </div>
  )
}
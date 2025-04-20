"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface NewsArticlesProps {
  year: number
}

interface NewsArticle {
  id: string
  title: string
  date: string
  source: string
  summary: string
  url: string
}

export function NewsArticles({ year }: NewsArticlesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Calculate date range (September of previous year to August of current year)
        const fromDate = `${year - 1}-09-01`
        const toDate = `${year}-08-31`
        
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
        ]

        // Search queries to use
        const queries = [
          `orçamento estado ${year}`,
          `execução orçamental ${year}`,
          `despesa pública ${year}`,
          `orçamento geral ${year}`
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
        
        // Remove duplicates by title + url (in case same headlines are on different domains)
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

        // Format and limit
        const processedArticles = interleaved
          .filter((item: any) => item.headline && item.headline.trim() !== "")
          .slice(0, 15)
          .map((item: any, index: number) => ({
            id: `${year}-${index}`,
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
  }, [year])
  
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
              Read full article
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
      {articles.length === 0 && !loading && (
        <div className="py-10 text-center text-muted-foreground">No news articles available for {year}</div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  date: string
  source: string
  summary: string
  url: string
}

export function RecentNews() {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Get the current year
        const currentYear = new Date().getFullYear()
        
        // Calculate date range (last 6 years)
        const today = new Date()
        const sixYearsAgo = new Date()
        sixYearsAgo.setFullYear(today.getFullYear() - 6)
        
        const fromDate = sixYearsAgo.toISOString().split('T')[0]
        const toDate = today.toISOString().split('T')[0]
        
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

        // Search queries to use
        const queries = [
          `orçamento estado ${currentYear}`,
          `execução orçamental ${currentYear}`,
          `despesa pública ${currentYear}`
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
        
        // Format and limit to 3 most recent articles
        const processedArticles = uniqueArticles
          .filter((item: any) => item.headline && item.headline.trim() !== "")
          .sort((a: any, b: any) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
          .slice(0, 3)
          .map((item: any, index: number) => ({
            id: index,
            uniqueId: `recent-${index}-${item.headline.substring(0, 20).replace(/\s+/g, '-')}`,
            title: item.headline,
            date: new Date(item.datetime).toISOString().split("T")[0],
            source: item.domain.replace("www.", ""),
            summary: "",
            url: item.url
          }))
        
        setNewsData(processedArticles)
      } catch (err) {
        console.error("Error fetching news:", err)
        setError("Failed to load news")
        setNewsData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNews()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">A carregar notícias...</div>
      </div>
    )
  }

  if (error || newsData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "Não há notícias disponíveis de momento"}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {newsData.map((news) => (
        <div key={news.uniqueId || `news-${news.id}`} className="border-b pb-3 last:border-0">
          <h3 className="font-medium">{news.title}</h3>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{news.date}</span>
            <span className="mx-2">•</span>
            <span>{news.source}</span>
          </div>
          <div className="mt-2">
            <Link href={news.url} className="inline-flex items-center text-sm text-primary hover:underline">
              Ler mais
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Link href="/news" className="text-sm text-primary hover:underline">
          Ver todas as notícias
        </Link>
      </div>
    </div>
  )
}

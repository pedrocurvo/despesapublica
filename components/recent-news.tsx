"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { NewsArticle, fetchNewsArticles, newsDomains, processNewsArticles } from "@/lib/news-utils"

export function RecentNews() {
  const [newsData, setNewsData] = useState<NewsArticle[]>([])
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
        sixYearsAgo.setFullYear(today.getFullYear() - 15)
        
        const fromDate = sixYearsAgo.toISOString().split('T')[0]
        const toDate = today.toISOString().split('T')[0]
        
        // Search queries to use
        const queries = [
          `orçamento estado ${currentYear}`,
          `execução orçamental ${currentYear}`,
          `despesa pública ${currentYear}`,
          `orçamento estado`,
          `execução orçamental`,
          `despesa pública`,
          `orçamento geral`,
          `OE`,
          `lei orçamento`,
          `relatório orçamento`,
          `debate orçamento`,
          `aprovação orçamento`,
          `ministro finanças orçamento`,
          `programa orçamental`,
          `medidas orçamentais`,
          `receitas estado`,
          `défice orçamental`,
          `discussão orçamento`
        ]
        
        // Fetch all articles using the utility function
        const rawArticles = await fetchNewsArticles(queries, fromDate, toDate, newsDomains, true)
        
        // Process and format articles
        const processedArticles = processNewsArticles(rawArticles, {
          keywords: ["orçamento", "despesa", "execução", "OE"],
          idPrefix: "recent",
          limit: 10,
        })

        // Sort articles by date
        processedArticles.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA
        })

        // Remove article mentioning Angola or Expresso
        const filteredArticles = processedArticles.filter(article => 
          !article.title.toLowerCase().includes("angola") && 
          !article.title.toLowerCase().includes("expresso")
        )
        // Set only to the first 3
        setNewsData(filteredArticles.slice(0, 3))

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
        <div key={news.id} className="border-b pb-3 last:border-0">
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

"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NewsArticle, fetchNewsArticles, newsDomains, processNewsArticles } from "@/lib/news-utils"

interface SectorNewsArticlesProps {
  year: string
  sector: string | null
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
        
        // Search queries using the sector name
        const queries = [
          `orçamento ${sector} ${year}`,
          `despesa ${sector} ${year}`,
          `${sector} orçamento estado ${year}`
        ]
        
        // Fetch all articles using the utility function
        const rawArticles = await fetchNewsArticles(
          queries, 
          fromDate, 
          toDate, 
          newsDomains, 
          true // silent mode - don't log errors
        )
        
        // Process and format articles
        const processedArticles = processNewsArticles(rawArticles, {
          keywords: [sector, "orçamento", "despesa"],
          idPrefix: `${year}-${sector}`,
          limit: 10, 
          specialWord: sector
        })
        
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
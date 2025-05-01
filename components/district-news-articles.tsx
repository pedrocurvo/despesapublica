"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NewsArticle, fetchNewsArticles, newsDomains, processNewsArticles } from "@/lib/news-utils"

interface DistrictNewsArticlesProps {
  year: string
  district: string | null
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
        
        // Search queries using the district name
        const queries = [
          `orçamento ${searchDistrict} ${year}`,
          `investimento ${searchDistrict} ${year}`,
          `financiamento ${searchDistrict} ${year}`,
          `transferências ${searchDistrict} ${year}`
        ]
        
        // Fetch all articles using the utility function
        const rawArticles = await fetchNewsArticles(
          queries, 
          fromDate, 
          toDate, 
          newsDomains, 
          false
        )
        
        // Process and format articles
        const processedArticles = processNewsArticles(rawArticles, {
          keywords: [searchDistrict, "orçamento", "investimento", "financiamento"],
          idPrefix: `${year}-${district}`,
          limit: 10,
          sortByRelevance: true,
          specialWord: searchDistrict,
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
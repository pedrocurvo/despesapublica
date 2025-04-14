"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: number
  uniqueId?: string  // Add this new optional property
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
        // Fetch the latest 4 news items
        const response = await fetch(`/api/news?limit=4`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch news data")
        }
        
        const data = await response.json()
        setNewsData(data)
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
        <div className="text-muted-foreground">Loading news...</div>
      </div>
    )
  }

  if (error || newsData.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "No news available at the moment"}
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
              Read more
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
      <div className="pt-2 text-center">
        <Link href="/news" className="text-sm text-primary hover:underline">
          View all news
        </Link>
      </div>
    </div>
  )
}

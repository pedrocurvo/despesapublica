"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"

const newsData = [
  {
    id: 1,
    title: "Government Approves 2023 Budget with Focus on Education",
    date: "2022-12-15",
    source: "Diário de Notícias",
    url: "#",
  },
  {
    id: 2,
    title: "Healthcare Spending Exceeds Budget Allocation for Third Year",
    date: "2023-03-22",
    source: "Público",
    url: "#",
  },
  {
    id: 3,
    title: "Defense Budget Increases Amid European Security Concerns",
    date: "2023-05-10",
    source: "Expresso",
    url: "#",
  },
  {
    id: 4,
    title: "Budget Execution Report Shows 98% Utilization Rate",
    date: "2023-07-05",
    source: "Jornal de Negócios",
    url: "#",
  },
]

export function RecentNews() {
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

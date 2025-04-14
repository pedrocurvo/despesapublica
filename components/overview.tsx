"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface YearlyBudget {
  year: string
  proposed: number
  expended: number
}

export function Overview() {
  const [data, setData] = useState<YearlyBudget[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBudgetOverview = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch budget data for the years 2018-2023
        const response = await fetch('/api/budget?startYear=2018&endYear=2023')
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget overview data')
        }
        
        const jsonData = await response.json()
        
        // Transform the data for the chart
        const chartData = Object.entries(jsonData).map(([year, yearData]: [string, any]) => ({
          year,
          proposed: yearData.total.proposed,
          expended: yearData.total.expended
        }))
        
        // Sort by year
        chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year))
        
        setData(chartData)
      } catch (err) {
        console.error("Error fetching budget overview:", err)
        setError("Failed to load budget overview")
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBudgetOverview()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">Loading budget overview...</div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "No budget data available"}
        </div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[80, 95]} tickFormatter={(value) => `€${value}B`} />
          <Tooltip
            formatter={(value) => [`€${value}B`, ""]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar name="Proposed Budget" dataKey="proposed" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar name="Expended Budget" dataKey="expended" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

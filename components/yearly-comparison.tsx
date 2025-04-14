"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface BudgetData {
  year: string
  proposed: number
  expended: number
}

export function YearlyComparison() {
  const [data, setData] = useState<BudgetData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBudgetData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch budget data for the years 2018-2023
        const response = await fetch('/api/budget?startYear=2018&endYear=2023')
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget data')
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
        console.error("Error fetching budget data:", err)
        setError("Failed to load budget data")
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBudgetData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground">Loading budget data...</div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "No budget data available"}
        </div>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        proposed: {
          label: "Proposed Budget (€B)",
          color: "hsl(var(--chart-1))",
        },
        expended: {
          label: "Expended Budget (€B)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[80, 95]} tickFormatter={(value) => `€${value}B`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line type="monotone" dataKey="proposed" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="expended" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

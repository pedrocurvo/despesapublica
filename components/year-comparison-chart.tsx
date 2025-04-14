"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface YearComparisonChartProps {
  selectedYears: string[]
}

export function YearComparisonChart({ selectedYears }: YearComparisonChartProps) {
  // Use state to control when we render the chart
  const [isMounted, setIsMounted] = useState(false)
  const [budgetData, setBudgetData] = useState<{[key: string]: {proposed: number, expended: number}}>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch the budget data
  useEffect(() => {
    const fetchBudgetData = async () => {
      if (selectedYears.length === 0) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch all needed years at once
        const response = await fetch(`/api/budget?startYear=${Math.min(...selectedYears.map(Number))}&endYear=${Math.max(...selectedYears.map(Number))}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget data')
        }
        
        const jsonData = await response.json()
        
        // Transform the data structure to match our needs
        const transformedData: {[key: string]: {proposed: number, expended: number}} = {}
        
        Object.entries(jsonData).forEach(([year, yearData]: [string, any]) => {
          transformedData[year] = {
            proposed: yearData.total.proposed,
            expended: yearData.total.expended
          }
        })
        
        setBudgetData(transformedData)
      } catch (err) {
        console.error("Error fetching budget data:", err)
        setError("Failed to load budget data")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBudgetData()
  }, [selectedYears])
  
  // Filter data based on selected years
  const data = selectedYears.map((year) => ({
    year,
    proposed: budgetData[year]?.proposed || 0,
    expended: budgetData[year]?.expended || 0,
  }))

  // Only render the chart component after the first client-side render
  // This helps avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If no years are selected, show a message
  if (selectedYears.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-muted-foreground">
        Select years to compare budget data
      </div>
    )
  }

  // Show a simple loading state during server rendering or first client render
  if (!isMounted || isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[80, 95]} tickFormatter={(value) => `€${value}B`} />
          <Tooltip
            formatter={(value) => [`€${value}B`, ""]}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar name="Proposed Budget" dataKey="proposed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={35} />
          <Bar name="Expended Budget" dataKey="expended" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={35} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

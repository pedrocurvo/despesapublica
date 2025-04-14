"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSectors } from "@/lib/sectors-context"

interface SectorData {
  year: string
  [key: string]: number | string
}

export function SectorComparison() {
  const { selectedSectors } = useSectors()
  const [data, setData] = useState<SectorData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSectorData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch budget data for all years (2018-2023)
        const response = await fetch('/api/budget?startYear=2018&endYear=2023')
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget data')
        }
        
        const jsonData = await response.json()
        
        // Transform the data for the chart
        const chartData = Object.entries(jsonData).map(([year, yearData]: [string, any]) => {
          // Create a base object with the year
          const yearObj: SectorData = { year }
          
          // Add all sectors to it
          Object.entries(yearData.sectors).forEach(([sector, sectorData]: [string, any]) => {
            // Use proposed budget value for each sector
            yearObj[sector] = (sectorData as any).proposed
          })
          
          return yearObj
        })
        
        // Sort by year
        chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year))
        
        setData(chartData)
      } catch (err) {
        console.error("Error fetching sector data:", err)
        setError("Failed to load sector data")
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchSectorData()
  }, [])

  // Create a config object that only includes selected sectors
  const chartConfig = {
    education: {
      label: "Education (€B)",
      color: "hsl(var(--chart-1))",
    },
    healthcare: {
      label: "Healthcare (€B)",
      color: "hsl(var(--chart-2))",
    },
    defense: {
      label: "Defense (€B)",
      color: "hsl(var(--chart-3))",
    },
    "social-security": {
      label: "Social Security (€B)",
      color: "hsl(var(--chart-4))",
    },
    infrastructure: {
      label: "Infrastructure (€B)",
      color: "hsl(var(--chart-5))",
    },
    justice: {
      label: "Justice (€B)",
      color: "hsl(var(--chart-6))",
    },
    environment: {
      label: "Environment (€B)",
      color: "hsl(var(--chart-7))",
    },
    culture: {
      label: "Culture (€B)",
      color: "hsl(var(--chart-8))",
    },
  }

  // Filter the config to only include selected sectors
  const filteredConfig = Object.fromEntries(
    Object.entries(chartConfig).filter(([key]) => selectedSectors.includes(key))
  )

  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground">Loading sector data...</div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "No sector data available"}
        </div>
      </div>
    )
  }

  return (
    <ChartContainer
      config={filteredConfig}
      className="h-[400px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={(value) => `€${value}B`} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
          {selectedSectors.map((sector) => (
            <Bar 
              key={sector}
              dataKey={sector} 
              fill={chartConfig[sector]?.color || "hsl(var(--chart-1))"} 
              radius={[4, 4, 0, 0]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

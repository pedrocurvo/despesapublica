"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Full budget data
const budgetData = {
  "2023": {
    proposed: 93.4,
    expended: 91.7,
  },
  "2022": {
    proposed: 91.3,
    expended: 90.5,
  },
  "2021": {
    proposed: 89.8,
    expended: 90.1,
  },
  "2020": {
    proposed: 87.5,
    expended: 89.2,
  },
  "2019": {
    proposed: 86.2,
    expended: 85.4,
  },
  "2018": {
    proposed: 84.6,
    expended: 83.1,
  },
}

interface YearComparisonChartProps {
  selectedYears: string[]
}

export function YearComparisonChart({ selectedYears }: YearComparisonChartProps) {
  // Use state to control when we render the chart
  const [isMounted, setIsMounted] = useState(false)
  
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
  if (!isMounted) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading chart...</div>
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

"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface BudgetSectorData {
  name: string
  value: number
  color: string
}

interface BudgetDistributionProps {
  year: string
  data?: BudgetSectorData[]
  isLoading?: boolean
}

// Color mapping for sectors
const sectorColors = {
  education: "#3b82f6",
  healthcare: "#ef4444",
  "social-security": "#f59e0b",
  infrastructure: "#10b981",
  defense: "#6366f1",
  justice: "#8b5cf6",
  environment: "#06b6d4",
  culture: "#ec4899",
  other: "#94a3b8",
}

export function BudgetDistribution({ year = "2023", data, isLoading = false }: BudgetDistributionProps) {
  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">Loading budget data...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">No budget data available for {year}</div>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`€${value}B`, ""]}
            contentStyle={{ backgroundColor: "hsl(var(--background))", borderColor: "hsl(var(--border))" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

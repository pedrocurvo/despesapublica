"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const budgetData = {
  "2023": [
    { name: "Education", value: 8.2, color: "#3b82f6" },
    { name: "Healthcare", value: 7.4, color: "#ef4444" },
    { name: "Social Security", value: 6.8, color: "#f59e0b" },
    { name: "Infrastructure", value: 5.2, color: "#10b981" },
    { name: "Defense", value: 2.5, color: "#6366f1" },
    { name: "Other", value: 63.3, color: "#94a3b8" },
  ],
  "2022": [
    { name: "Education", value: 7.9, color: "#3b82f6" },
    { name: "Healthcare", value: 7.2, color: "#ef4444" },
    { name: "Social Security", value: 6.5, color: "#f59e0b" },
    { name: "Infrastructure", value: 5.0, color: "#10b981" },
    { name: "Defense", value: 2.4, color: "#6366f1" },
    { name: "Other", value: 62.3, color: "#94a3b8" },
  ],
  "2021": [
    { name: "Education", value: 7.5, color: "#3b82f6" },
    { name: "Healthcare", value: 7.1, color: "#ef4444" },
    { name: "Social Security", value: 6.2, color: "#f59e0b" },
    { name: "Infrastructure", value: 4.7, color: "#10b981" },
    { name: "Defense", value: 2.3, color: "#6366f1" },
    { name: "Other", value: 62.0, color: "#94a3b8" },
  ],
  "2020": [
    { name: "Education", value: 7.2, color: "#3b82f6" },
    { name: "Healthcare", value: 6.9, color: "#ef4444" },
    { name: "Social Security", value: 6.0, color: "#f59e0b" },
    { name: "Infrastructure", value: 4.5, color: "#10b981" },
    { name: "Defense", value: 2.2, color: "#6366f1" },
    { name: "Other", value: 60.7, color: "#94a3b8" },
  ],
  "2019": [
    { name: "Education", value: 7.0, color: "#3b82f6" },
    { name: "Healthcare", value: 6.3, color: "#ef4444" },
    { name: "Social Security", value: 5.7, color: "#f59e0b" },
    { name: "Infrastructure", value: 4.4, color: "#10b981" },
    { name: "Defense", value: 2.1, color: "#6366f1" },
    { name: "Other", value: 60.7, color: "#94a3b8" },
  ],
  "2018": [
    { name: "Education", value: 6.8, color: "#3b82f6" },
    { name: "Healthcare", value: 6.1, color: "#ef4444" },
    { name: "Social Security", value: 5.5, color: "#f59e0b" },
    { name: "Infrastructure", value: 4.2, color: "#10b981" },
    { name: "Defense", value: 2.0, color: "#6366f1" },
    { name: "Other", value: 60.0, color: "#94a3b8" },
  ],
}

interface BudgetDistributionProps {
  year: string
}

export function BudgetDistribution({ year = "2023" }: BudgetDistributionProps) {
  const data = budgetData[year] || budgetData["2023"]

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

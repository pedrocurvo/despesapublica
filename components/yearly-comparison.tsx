"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    year: "2018",
    proposed: 84.6,
    expended: 83.1,
  },
  {
    year: "2019",
    proposed: 86.2,
    expended: 85.4,
  },
  {
    year: "2020",
    proposed: 87.5,
    expended: 89.2,
  },
  {
    year: "2021",
    proposed: 89.8,
    expended: 90.1,
  },
  {
    year: "2022",
    proposed: 91.3,
    expended: 90.5,
  },
  {
    year: "2023",
    proposed: 93.4,
    expended: 91.7,
  },
]

export function YearlyComparison() {
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

"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useSectors } from "@/lib/sectors-context"

const data = [
  {
    year: "2018",
    education: 6.8,
    healthcare: 6.1,
    defense: 2.0,
  },
  {
    year: "2019",
    education: 7.0,
    healthcare: 6.3,
    defense: 2.1,
  },
  {
    year: "2020",
    education: 7.2,
    healthcare: 6.9,
    defense: 2.2,
  },
  {
    year: "2021",
    education: 7.5,
    healthcare: 7.1,
    defense: 2.3,
  },
  {
    year: "2022",
    education: 7.9,
    healthcare: 7.2,
    defense: 2.4,
  },
  {
    year: "2023",
    education: 8.2,
    healthcare: 7.4,
    defense: 2.5,
  },
]

export function SectorComparison() {
  const { selectedSectors } = useSectors()

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
  }

  // Filter the config to only include selected sectors
  const filteredConfig = Object.fromEntries(
    Object.entries(chartConfig).filter(([key]) => selectedSectors.includes(key))
  )

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
          {selectedSectors.includes("education") && (
            <Bar dataKey="education" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          )}
          {selectedSectors.includes("healthcare") && (
            <Bar dataKey="healthcare" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          )}
          {selectedSectors.includes("defense") && (
            <Bar dataKey="defense" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

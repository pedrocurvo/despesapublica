"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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

export function Overview() {
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

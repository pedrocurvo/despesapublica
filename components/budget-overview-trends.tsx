"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface BalanceData {
  year: string
  receitaActual: number
  despesaActual: number
  saldoActual: number
  pibPercentage: number
}

export function BudgetOverviewTrends() {
  const [data, setData] = useState<BalanceData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalanceData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch balance data for years 2013-2023
        const response = await fetch('/api/balance?startYear=2013&endYear=2023')
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget balance data')
        }
        
        const jsonData = await response.json()
        
        // Transform the data for the chart, but only include actual values (not budget values)
        const chartData = Object.entries(jsonData).map(([year, yearData]: [string, any]) => {
          // Skip years with missing/malformed data
          if (!yearData || !yearData.Receita || !yearData.Despesa) {
            console.warn(`Missing or invalid data for year ${year}`)
            return null
          }
          
          return {
            year,
            receitaActual: yearData.Receita.Year !== undefined ? Number((yearData.Receita.Year).toFixed(2)) : null,
            despesaActual: yearData.Despesa.Year !== undefined ? Number((yearData.Despesa.Year).toFixed(2)) : null,
            saldoActual: yearData.Saldo?.Year !== undefined ? Number((yearData.Saldo.Year).toFixed(2)) : null,
            pibPercentage: yearData.PIBper?.Year !== undefined ? Number((yearData.PIBper.Year * 100).toFixed(2)) : null,
          }
        })
        .filter(item => item !== null) // Remove any null items
        
        // Sort by year
        chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year))
        
        setData(chartData)
      } catch (err) {
        console.error("Error fetching budget balance data:", err)
        setError("Failed to load budget overview")
        setData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBalanceData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">A carregar tendências orçamentais...</div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">Não existem dados de tendências disponíveis</div>
      </div>
    )
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const yearData = payload[0].payload;
      return (
        <div className="rounded-md bg-background p-4 shadow-md border border-border text-sm">
          <p className="font-medium">{`Ano: ${label}`}</p>
          <div className="mt-2 space-y-1">
            <p className="text-blue-600">{`Receita Real: ${yearData.receitaActual !== null ? `€${(yearData.receitaActual/1000).toFixed(2)}MM` : 'N/D'}`}</p>
            <p className="text-red-600">{`Despesa Real: ${yearData.despesaActual !== null ? `€${(yearData.despesaActual/1000).toFixed(2)}MM` : 'N/D'}`}</p>
            <div className="border-t border-border my-2"></div>
            <div className={`font-medium ${yearData.saldoActual !== null ? (yearData.saldoActual >= 0 ? "text-green-500" : "text-red-500") : "text-muted-foreground"}`}>
<p>              {`Saldo Efetivo:`}</p>
              <div className="pl-2 mt-1 text-sm">
                <p>{`Em €: ${yearData.saldoActual !== null ? `€${(yearData.saldoActual/1000).toFixed(2)}MM` : 'N/D'}`}            </p>
            <p className="text-muted-foreground">{`Em % do PIB: ${yearData.pibPercentage !== null ? `${yearData.pibPercentage}%` : 'N/D'}`}            </p>
</div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <ChartContainer
      config={{
        receitaActual: { 
          label: "Receita Real (€MM)", 
          color: "hsl(217.2 91.2% 59.8%)" 
        },
        despesaActual: { 
          label: "Despesa Real (€MM)", 
          color: "hsl(0 72.2% 50.6%)" 
        },
      }}
      className="aspect-[16/9] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis 
            domain={[80000, 120000]} 
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}MM`} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.8rem', marginTop: '5px' }} />
          <Line
            type="monotone"
            dataKey="receitaActual"
            stroke="hsl(217.2 91.2% 59.8%)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Receita Real"
          />
          <Line
            type="monotone"
            dataKey="despesaActual"
            stroke="hsl(0 72.2% 50.6%)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Despesa Real"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BalanceData {
  year: string
  receitaActual: number
  despesaActual: number
  saldoActual: number
  pibPercentage: number
}

interface OverviewProps {
  startYear?: number;
  endYear?: number;
}

export function Overview({ startYear = 2018, endYear = 2023 }: OverviewProps) {
  const [data, setData] = useState<BalanceData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalanceData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Fetch balance data using the provided year range
        const response = await fetch(`/api/balance?startYear=${startYear}&endYear=${endYear}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch budget balance data')
        }
        
        const jsonData = await response.json()
        
        // Transform the data for the chart
        const chartData = Object.entries(jsonData).map(([year, yearData]: [string, any]) => {
          // Skip years with missing/malformed data
          if (!yearData || !yearData.Receita || !yearData.Despesa) {
            console.warn(`Missing or invalid data for year ${year}`);
            return null;
          }
          
          return {
            year,
            receitaActual: yearData.Receita.Year !== undefined ? Number((yearData.Receita.Year).toFixed(2)) : null,
            despesaActual: yearData.Despesa.Year !== undefined ? Number((yearData.Despesa.Year).toFixed(2)) : null,
            saldoActual: yearData.Saldo?.Year !== undefined ? Number((yearData.Saldo.Year).toFixed(2)) : null,
            pibPercentage: yearData.PIBper?.Year !== undefined ? Number((yearData.PIBper.Year * 100).toFixed(2)) : null,
          };
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
  }, [startYear, endYear])

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">A carregar visão geral do orçamento...</div>
      </div>
    )
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "Não existem dados orçamentais disponíveis"}
        </div>
      </div>
    )
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const yearData = payload[0].payload;
      return (
        <div className="rounded-md bg-background p-4 shadow-md border border-border text-sm">
          <p className="font-medium">{`Ano: ${label}`}</p>
          <div className="mt-2 space-y-1">
            <p className="text-blue-600">{`Receita Efetiva: ${yearData.receitaActual !== null ? `€${(yearData.receitaActual/1000).toFixed(2)}MM` : 'N/D'}`}</p>
            <p className="text-red-600">{`Despesa Efetiva: ${yearData.despesaActual !== null ? `€${(yearData.despesaActual/1000).toFixed(2)}MM` : 'N/D'}`}</p>
            <div className="border-t border-border my-2"></div>
            <div className={`font-medium ${yearData.saldoActual !== null ? (yearData.saldoActual >= 0 ? "text-green-500" : "text-red-500") : "text-muted-foreground"}`}>
              <p>{`Saldo Efetivo:`}</p>
              <div className="pl-2 mt-1 text-sm">
                <p>{`Em €: ${yearData.saldoActual !== null ? `${(yearData.saldoActual/1000).toFixed(2)}MM` : 'N/D'}`}</p>
                <p className="text-muted-foreground">{`Em % do PIB: ${yearData.pibPercentage !== null ? `${yearData.pibPercentage}%` : 'N/D'}`}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[60000, 120000]} tickFormatter={(value) => `€${(value/1000).toFixed(0)}MM`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar name="Receita" dataKey="receitaActual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar name="Despesa" dataKey="despesaActual" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

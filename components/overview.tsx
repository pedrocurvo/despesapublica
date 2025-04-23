"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface BalanceData {
  year: string
  receitaBudget: number
  despesaBudget: number
  receitaActual: number
  despesaActual: number
  saldoBudget: number
  saldoActual: number
  pibPercentage: number
  pibBudgetPercentage: number
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
            receitaBudget: yearData.Receita.Budget !== undefined ? Number((yearData.Receita.Budget).toFixed(2)) : null,
            despesaBudget: yearData.Despesa.Budget !== undefined ? Number((yearData.Despesa.Budget).toFixed(2)) : null,
            receitaActual: yearData.Receita.Year !== undefined ? Number((yearData.Receita.Year).toFixed(2)) : null,
            despesaActual: yearData.Despesa.Year !== undefined ? Number((yearData.Despesa.Year).toFixed(2)) : null,
            saldoBudget: yearData.Saldo?.Budget !== undefined ? Number((yearData.Saldo.Budget).toFixed(2)) : null,
            saldoActual: yearData.Saldo?.Year !== undefined ? Number((yearData.Saldo.Year).toFixed(2)) : null,
            pibPercentage: yearData.PIBper?.Year !== undefined ? Number((yearData.PIBper.Year * 100).toFixed(2)) : null,
            pibBudgetPercentage: yearData.PIBper?.Budget !== undefined ? Number((yearData.PIBper.Budget * 100).toFixed(2)) : null
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
            <p className="text-blue-500">{`Orçamento de Receita: ${yearData.receitaBudget !== null ? `€${yearData.receitaBudget}M` : 'N/D'}`}</p>
            <p className="text-blue-600">{`Receita Real: ${yearData.receitaActual !== null ? `€${yearData.receitaActual}M` : 'N/D'}`}</p>
            <p className="text-red-500">{`Orçamento de Despesa: ${yearData.despesaBudget !== null ? `€${yearData.despesaBudget}M` : 'N/D'}`}</p>
            <p className="text-red-600">{`Despesa Real: ${yearData.despesaActual !== null ? `€${yearData.despesaActual}M` : 'N/D'}`}</p>
            <div className="border-t border-border my-2"></div>
            <p className={`font-medium ${yearData.saldoActual !== null ? (yearData.saldoActual >= 0 ? "text-green-500" : "text-red-500") : "text-muted-foreground"}`}>
              {`Saldo Real: ${yearData.saldoActual !== null ? `€${yearData.saldoActual}M` : 'N/D'}`}
            </p>
            <p className={`font-medium ${yearData.saldoBudget !== null ? (yearData.saldoBudget >= 0 ? "text-green-500" : "text-red-500") : "text-muted-foreground"}`}>
              {`Saldo Orçamentado: ${yearData.saldoBudget !== null ? `€${yearData.saldoBudget}M` : 'N/D'}`}
            </p>
            <div className="border-t border-border my-2"></div>
            <p className="text-muted-foreground">{`% do PIB Real: ${yearData.pibPercentage !== null ? `${yearData.pibPercentage}%` : 'N/D'}`}</p>
            <p className="text-muted-foreground">{`% do PIB Orçamentado: ${yearData.pibBudgetPercentage !== null ? `${yearData.pibBudgetPercentage}%` : 'N/D'}`}</p>
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
          <YAxis domain={[80000, 120000]} tickFormatter={(value) => `€${value}M`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar name="Revenue Budget" dataKey="receitaBudget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar name="Expense Budget" dataKey="despesaBudget" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

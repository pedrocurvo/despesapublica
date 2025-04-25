"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ExpenseData {
  year: string
  budgeted: number
  executed: number
}

interface ExpenseOverviewProps {
  startYear?: number;
  endYear?: number;
  onYearClick?: (year: string) => void;
}

export function ExpenseOverview({ startYear = 2018, endYear = 2023, onYearClick }: ExpenseOverviewProps) {
  const [data, setData] = useState<ExpenseData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpenseData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Create an array of years to fetch
        const years = Array.from(
          { length: endYear - startYear + 1 },
          (_, i) => startYear + i
        );
        
        // Fetch data for each year
        const yearDataPromises = years.map(async (year) => {
          const response = await fetch(`/api/despesa?year=${year}`);
          if (!response.ok) {
            return null;
          }
          const data = await response.json();
          return { year, data };
        });
        
        const yearResults = await Promise.all(yearDataPromises);
        
        // Transform the data for the chart with the new JSON format
        const chartData = yearResults
          .filter(result => result !== null)
          .map(result => {
            const { year, data } = result;
            
            // Extract data from the new JSON structure
            const yearData = data[year];
            
            if (!yearData) {
              console.warn(`Missing expense data for year ${year}`);
              return null;
            }
            
            return {
              year: year.toString(),
              budgeted: Number(yearData.despesa_orcamentada.toFixed(2)),
              executed: Number(yearData.despesa_executada_efetiva_consolidada.toFixed(2))
            };
          })
          .filter(item => item !== null);
        
        // Sort by year
        chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
        
        setData(chartData);
      } catch (err) {
        console.error("Error fetching expense data:", err);
        setError("Failed to load expense overview");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpenseData();
  }, [startYear, endYear]);

  if (isLoading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">A carregar panorama de despesas...</div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <div className="text-muted-foreground">
          {error || "Não existem dados de despesa disponíveis"}
        </div>
      </div>
    );
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const yearData = payload[0].payload;
      return (
        <div className="rounded-md bg-background p-4 shadow-md border border-border text-sm">
          <p className="font-medium">{`Ano: ${label}`}</p>
          <div className="mt-2 space-y-1">
            <p className="text-blue-500">{`Orçamentado: €${(yearData.budgeted/1000).toLocaleString()}MM`}</p>
            <p className="text-red-500">{`Executado: €${(yearData.executed/1000).toLocaleString()}MM`}</p>
            <div className="border-t border-border my-2"></div>
            <p className={`font-medium ${
              yearData.executed <= yearData.budgeted ? "text-green-500" : "text-red-500"
            }`}>
              {`Taxa de Execução: ${((yearData.executed / yearData.budgeted) * 100).toFixed(2)}%`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleBarClick = (data: any) => {
    if (onYearClick && data?.activePayload?.[0]?.payload?.year) {
      onYearClick(data.activePayload[0].payload.year);
    }
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          onClick={handleBarClick}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="year" />
          <YAxis domain={[80000, 120000]} tickFormatter={(value) => `€${(value/1000).toFixed(0)}MM`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 10 }} />
          <Bar name="Despesa Orçamentada" dataKey="budgeted" fill="#3b82f6" radius={[4, 4, 0, 0]} cursor="pointer" />
          <Bar name="Despesa Real (Executada)" dataKey="executed" fill="#ef4444" radius={[4, 4, 0, 0]} cursor="pointer" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
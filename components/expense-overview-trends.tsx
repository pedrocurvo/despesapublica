"use client"

import { useState, useEffect } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

interface ExpenseData {
  year: string
  budgeted: number
  executed: number
}

export function ExpenseOverviewTrends() {
  const [data, setData] = useState<ExpenseData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchExpenseData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Create an array of years to fetch (2015-2023)
        const years = Array.from(
          { length: 9 },
          (_, i) => 2015 + i
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
              budgeted: Number((yearData.despesa_orcamentada / 1000).toFixed(2)), // Convert to billions
              executed: Number((yearData.despesa_executada_efetiva_consolidada / 1000).toFixed(2)) // Convert to billions
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
  }, []);

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
            <p className="text-blue-500">{`Orçamentado: €${yearData.budgeted?.toLocaleString()}MM`}</p>
            <p className="text-red-500">{`Executado: €${yearData.executed?.toLocaleString()}MM`}</p>
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

  return (
    <ChartContainer
      config={{
        budgeted: { 
          label: "Despesas Orçamentadas (€MM)", 
          color: "hsl(221.2 83.2% 53.3%)" 
        },
        executed: { 
          label: "Despesas Executadas (€MM)", 
          color: "hsl(0 84.2% 60.2%)" 
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
          <YAxis tickFormatter={(value) => `€${value}MM`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '0.8rem', marginTop: '5px' }} />
          <Line
            type="monotone"
            dataKey="budgeted"
            stroke="hsl(221.2 83.2% 53.3%)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Orçamentado"
          />
          <Line
            type="monotone"
            dataKey="executed"
            stroke="hsl(0 84.2% 60.2%)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Executado"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
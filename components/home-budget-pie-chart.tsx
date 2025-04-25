"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer } from "recharts";
import { ChartContainer } from "./ui/chart";
import { formatCurrency } from "@/lib/utils";

// Interfaces
interface BudgetData {
  [year: string]: {
    despesa_orcamentada: number;
    despesa_executada_efetiva_consolidada: number;
    grau_execução: number;
    setores: {
      [key: string]: {
        despesa_orcamentada: number;
        despesa_executada_efetiva_consolidada: number;
        despesa_executada_total_nao_consolidada: number;
        grau_execução: number;
        medidas: {
          [key: string]: number;
        };
      };
    };
  };
}

interface ChartData {
  name: string;
  value: number;
}

interface HomeBudgetPieChartProps {
  year: string;
  onSectorClick?: (sector: string | null) => void;
}

// Color palette for the pie chart
const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82ca9d", "#8dd1e1", "#a4de6c", "#d0ed57", "#ffc658",
  "#6b486b", "#2F4858", "#86BBD8", "#F26419", "#33658A",
  "#55DDE0", "#2A9D8F", "#F4A261", "#E76F51", "#264653"
];

// Active shape renderer with enhanced formatting for the home page
const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent
  } = props;

  return (
    <g>
      {/* Display sector name above the chart */}
      <text x={cx} y={cy - outerRadius - 20} textAnchor="middle" fill="#333" fontSize="15" fontWeight="700">
        {payload.name}
      </text>
      
      {/* Display values in the center with more spacing */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#333" fontSize="15" fontWeight="500">
        {`€${(payload.value/1000).toFixed(2)}MM`}
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#555" fontSize="12">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      
      {/* Highlighted sector with better visual emphasis */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - 6}
        outerRadius={innerRadius - 2}
        fill={fill}
      />
    </g>
  );
};

export default function HomeBudgetPieChart({ year, onSectorClick }: HomeBudgetPieChartProps) {
  const [budgetData, setBudgetData] = React.useState<BudgetData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [selectedSector, setSelectedSector] = React.useState<string | null>(null);
  
  // Fetch budget data
  React.useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/despesa?year=${year}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        setBudgetData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch budget data");
        console.error("Failed to fetch budget data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgetData();
  }, [year]);
  
  // Format data for the pie chart - simplified for home page
  const formatChartData = (data: BudgetData | null): ChartData[] => {
    if (!data) return [];
    
    return Object.entries(data[year]?.setores || {})
      .map(([name, sectorData]) => ({
        name,
        value: sectorData.despesa_executada_efetiva_consolidada
      }))
      .sort((a, b) => b.value - a.value);
  };
  
  const chartData = formatChartData(budgetData);
  
  const handlePieClick = (_: any, index: number) => {    
    const sectorName = chartData[index].name;
    
    if (onSectorClick) {
      onSectorClick(sectorName);
    }
  };
  
  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-full">A carregar dados do orçamento...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 text-sm">Erro: {error}</div>;
  }
  
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <ChartContainer 
        config={{
          expenses: { label: "Despesas" },
        }}
        className="aspect-square w-full max-w-[500px] mx-auto"
      >
        <ResponsiveContainer width="100%" height="100%" aspect={1}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="30%"
              outerRadius="70%"
              dataKey="value"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handlePieClick}
              animationBegin={0}
              animationDuration={800}
              style={{ cursor: 'pointer' }}
            >
              {chartData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
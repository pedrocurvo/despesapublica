"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { ChartContainer } from "./ui/chart";
import { formatCurrency } from "@/lib/utils";

interface BudgetData {
  sectors: {
    [key: string]: {
      "Despesa Total Nao Consolidada": {
        "Orcamento Corrigido": number;
        "Execucao": number;
      };
      "Despesa Total Consolidada": {
        "Orcamento Corrigido": number;
        "Execucao": number;
      };
      "Despesa Efetiva Consolidada": {
        "Orcamento Corrigido": number;
        "Execucao": number;
      };
      "Subsectors": {
        [key: string]: {
          "Orcamento Corrigido": number;
          "Execucao": number;
        };
      };
    };
  };
}

interface ChartData {
  name: string;
  value: number;
  despesaTotalNaoConsolidada: number;
  despesaTotalConsolidada: number;
  despesaEfetivaConsolidada: number;
}

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8",
  "#82ca9d", "#8dd1e1", "#a4de6c", "#d0ed57", "#ffc658",
  "#6b486b", "#2F4858", "#86BBD8", "#F26419", "#33658A",
  "#55DDE0", "#2A9D8F", "#F4A261", "#E76F51", "#264653"
];

const renderActiveShape = (props: any) => {
  const {
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888">
        {payload.name}
      </text>
      <text x={cx} y={cy} textAnchor="middle" fill="#333" className="text-lg font-semibold">
        {formatCurrency(payload.value)}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#888">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-white p-4 border border-gray-300 rounded-md shadow-md">
        <p className="font-bold">{data.name}</p>
        <p className="text-sm text-muted-foreground mb-2">(Valores em milhões de euros)</p>
        <p>Despesa Efetiva Consolidada (Execução): {formatCurrency(data.value)}</p>
        <p>Despesa Total Não Consolidada: {formatCurrency(data.despesaTotalNaoConsolidada)}</p>
        <p>Despesa Total Consolidada: {formatCurrency(data.despesaTotalConsolidada)}</p>
        <p>Despesa Efetiva Consolidada: {formatCurrency(data.despesaEfetivaConsolidada)}</p>
      </div>
    );
  }
  
  return null;
};

export default function BudgetPieChart({ year = "2023" }: { year?: string }) {
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
        const response = await fetch(`/api/public/despesa?year=${year}`);
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
    // Reset selected sector when year changes
    setSelectedSector(null);
  }, [year]);
  
  // Format data for the pie chart
  const formatChartData = (data: BudgetData | null, sector: string | null): ChartData[] => {
    if (!data) return [];
    
    if (sector && data.sectors[sector]) {
      const subsectors = data.sectors[sector].Subsectors;
      return Object.entries(subsectors)
        .filter(([name]) => name !== "DESPESA TOTAL NÃO CONSOLIDADA" && name !== "DESPESA TOTAL CONSOLIDADA")
        .map(([name, values]) => ({
          name,
          value: values.Execucao,
          despesaTotalNaoConsolidada: values.Execucao, // For subsectors, we don't have these values separately
          despesaTotalConsolidada: values.Execucao,    // So we use the same value for all
          despesaEfetivaConsolidada: values.Execucao
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    return Object.entries(data.sectors).map(([name, sectorData]) => ({
      name,
      value: sectorData["Despesa Efetiva Consolidada"].Execucao,
      despesaTotalNaoConsolidada: sectorData["Despesa Total Nao Consolidada"].Execucao,
      despesaTotalConsolidada: sectorData["Despesa Total Consolidada"].Execucao,
      despesaEfetivaConsolidada: sectorData["Despesa Efetiva Consolidada"].Execucao
    }))
    .sort((a, b) => b.value - a.value);
  };
  
  const chartData = formatChartData(budgetData, selectedSector);
  
  const handlePieClick = (_: any, index: number) => {
    if (selectedSector) return; // Don't handle clicks when already showing subsectors
    
    const sectorName = chartData[index].name;
    setSelectedSector(sectorName);
  };
  
  const handleMouseEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  const handleBackClick = () => {
    setSelectedSector(null);
    setActiveIndex(null);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-60">Carregando dados do orçamento...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Erro: {error}</div>;
  }
  
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">
            {selectedSector 
              ? `Despesa por Subsector: ${selectedSector}` 
              : "Despesa por Sector"}
          </h2>
          
          {selectedSector && (
            <Button 
              variant="outline" 
              onClick={handleBackClick}
              className="mt-2"
            >
              ← Voltar para todos os sectores
            </Button>
          )}
        </div>
        
        <div className="w-full h-[400px] mb-10">
          <ChartContainer 
            config={{
              expenses: { label: "Despesas" },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  activeIndex={activeIndex !== null ? activeIndex : undefined}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  dataKey="value"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handlePieClick}
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Legend */}
        <div className="w-full mt-4 px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            {chartData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-sm mr-2 flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                />
                <span className="text-sm truncate" title={entry.name}>
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
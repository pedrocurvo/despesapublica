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
  despesaTotalNaoConsolidada: {
    orcamento: number;
    execucao: number;
  };
  despesaTotalConsolidada: {
    orcamento: number;
    execucao: number;
  };
  despesaEfetivaConsolidada: {
    orcamento: number;
    execucao: number;
  };
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
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888" fontSize="12">
        {payload.name}
      </text>
      <text x={cx} y={cy} textAnchor="middle" fill="#333" fontSize="14" fontWeight="500">
        {formatCurrency(payload.value)}
      </text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#888" fontSize="12">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + Math.min(6, outerRadius * 0.05)}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={innerRadius - Math.min(6, innerRadius * 0.1)}
        outerRadius={innerRadius - Math.min(2, innerRadius * 0.03)}
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
        <p className="text-sm font-bold">{data.name}</p>
        <p className="text-sm text-muted-foreground mb-2">(Valores em milhões de euros)</p>
        
        <div className="space-y-2">
          <div>
            <p className="font-semibold">Despesa Total Não Consolidada:</p>
            <p>• Orçamento Corrigido: {formatCurrency(data.despesaTotalNaoConsolidada.orcamento)}</p>
            <p>• Execução: {formatCurrency(data.despesaTotalNaoConsolidada.execucao)}</p>
          </div>
          
          <div>
            <p className="font-semibold">Despesa Total Consolidada:</p>
            <p>• Orçamento Corrigido: {formatCurrency(data.despesaTotalConsolidada.orcamento)}</p>
            <p>• Execução: {formatCurrency(data.despesaTotalConsolidada.execucao)}</p>
          </div>
          
          <div>
            <p className="font-semibold">Despesa Efetiva Consolidada:</p>
            <p>• Orçamento Corrigido: {formatCurrency(data.despesaEfetivaConsolidada.orcamento)}</p>
            <p>• Execução: {formatCurrency(data.despesaEfetivaConsolidada.execucao)}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

interface BudgetPieChartProps {
  year?: string;
  showTooltip?: boolean;
  enableSectorClick?: boolean;
  showTitle?: boolean;
  showLegend?: boolean;
}

export default function BudgetPieChart({ 
  year = "2023", 
  showTooltip = true, 
  enableSectorClick = true,
  showTitle = true,
  showLegend = true
}: BudgetPieChartProps) {
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
          despesaTotalNaoConsolidada: {
            orcamento: values["Orcamento Corrigido"],
            execucao: values.Execucao
          },
          despesaTotalConsolidada: {
            orcamento: values["Orcamento Corrigido"],
            execucao: values.Execucao
          },
          despesaEfetivaConsolidada: {
            orcamento: values["Orcamento Corrigido"],
            execucao: values.Execucao
          }
        }))
        .sort((a, b) => b.value - a.value);
    }
    
    return Object.entries(data.sectors).map(([name, sectorData]) => ({
      name,
      value: sectorData["Despesa Efetiva Consolidada"].Execucao,
      despesaTotalNaoConsolidada: {
        orcamento: sectorData["Despesa Total Nao Consolidada"]["Orcamento Corrigido"],
        execucao: sectorData["Despesa Total Nao Consolidada"].Execucao
      },
      despesaTotalConsolidada: {
        orcamento: sectorData["Despesa Total Consolidada"]["Orcamento Corrigido"],
        execucao: sectorData["Despesa Total Consolidada"].Execucao
      },
      despesaEfetivaConsolidada: {
        orcamento: sectorData["Despesa Efetiva Consolidada"]["Orcamento Corrigido"],
        execucao: sectorData["Despesa Efetiva Consolidada"].Execucao
      }
    }))
    .sort((a, b) => b.value - a.value);
  };
  
  const chartData = formatChartData(budgetData, selectedSector);
  
  const handlePieClick = (_: any, index: number) => {
    if (!enableSectorClick || selectedSector) return; // Don't handle clicks when disabled or already showing subsectors
    
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
      <div className="w-full">
        {showTitle && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">
              {selectedSector 
                ? `Despesa por Subsector: ${selectedSector}` 
                : "Despesa por Sector"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {selectedSector 
                ? null 
                : "Clique num sector para ver os detalhes"}
            </p>
            
            {selectedSector && enableSectorClick && (
              <Button 
                variant="outline" 
                onClick={handleBackClick}
                className="mt-2"
              >
                ← Voltar para todos os sectores
              </Button>
            )}
          </div>
        )}
        
        <div className="w-full min-h-[400px] mb-4">
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
                  innerRadius="30%"
                  outerRadius="60%"
                  dataKey="value"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={enableSectorClick ? handlePieClick : undefined}
                  animationBegin={0}
                  animationDuration={800}
                  style={enableSectorClick ? { cursor: 'pointer' } : {}}
                >
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="#fff"
                      strokeWidth={2}
                      style={enableSectorClick ? { cursor: 'pointer' } : {}}
                    />
                  ))}
                </Pie>
                {showTooltip && <Tooltip content={<CustomTooltip />} />}
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        
        {/* Legend */}
        {showLegend && (
          <div className="w-full mt-1 sm:mt-1.5 md:mt-2 px-2 md:px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-2 gap-y-2">
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
        )}
      </div>
    </div>
  );
}
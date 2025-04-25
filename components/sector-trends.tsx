"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Years to fetch data for
const YEARS = ["2022", "2023"]

type SectorData = {
  name: string
  value: number
  percentage: number
  subsectors?: SubsectorData[]
}

type SubsectorData = {
  name: string
  value: number
  percentage: number
}

type BudgetData = {
  sectors: {
    [key: string]: {
      "Despesa Efetiva Consolidada": {
        "Execucao": number;
      };
      "Subsectors"?: {
        [key: string]: {
          "Execucao": number;
        };
      };
    };
  };
}

// Color palette for the lines
const COLORS = [
  "#0ea5e9", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#ef4444", // Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#f97316", // Orange
  "#14b8a6", // Teal
  "#84cc16", // Lime
  "#6366f1", // Indigo
]

export function SectorTrends() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yearData, setYearData] = useState<Record<string, BudgetData>>({})
  const [sectors, setSectors] = useState<string[]>([])
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [subsectors, setSubsectors] = useState<string[]>([])
  const [selectedSubsectors, setSelectedSubsectors] = useState<string[]>([])
  const [showAllSubsectors, setShowAllSubsectors] = useState(false)
  const [selectedType, setSelectedType] = useState<'absolute' | 'percentage'>('absolute')
  const [trendData, setTrendData] = useState<Record<string, { trend: 'up' | 'down' | 'neutral', percentage: number }>>({})
  const [baseYear, setBaseYear] = useState<string>(YEARS[0])

  // Get the proper case format of a name (first letter of each word capitalized)
  const toProperCase = (name: string) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Add CSS transition classes for subsector selection container
  const getSubsectorSelectionClasses = () => {
    return `space-y-1 transition-all duration-300 ease-in-out ${
      showAllSubsectors ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-[500px]'
    }`;
  }

  // Fetch data for all years
  useEffect(() => {
    const fetchAllYearData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result: Record<string, BudgetData> = {}
        
        // Fetch data for each year
        for (const year of YEARS) {
          const response = await fetch(`/api/despesa?year=${year}`)
          
          if (!response.ok) {
            throw new Error(`Failed to load data for ${year}`)
          }
          
          const data = await response.json()
          result[year] = data
        }
        
        setYearData(result)
        
        // Extract all sector names from the first year's data
        const firstYearData = result[YEARS[0]]
        const sectorNames = firstYearData ? Object.keys(firstYearData.sectors) : []
        setSectors(sectorNames)
        
        // Calculate trends for sectors and subsectors
        calculateTrends(result, baseYear)
        
        setLoading(false)
      } catch (err) {
        console.error("Error fetching budget data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
        setLoading(false)
      }
    }
    
    fetchAllYearData()
  }, [])
  
  // Recalculate trends when base year changes
  useEffect(() => {
    if (Object.keys(yearData).length > 0) {
      calculateTrends(yearData, baseYear)
    }
  }, [baseYear, yearData])
  
  // Calculate trends for sectors and subsectors
  const calculateTrends = (data: Record<string, BudgetData>, fromYear: string) => {
    const trends: Record<string, { trend: 'up' | 'down' | 'neutral', percentage: number }> = {}
    
    // We need at least two years of data to calculate trends
    if (Object.keys(data).length < 2) return
    
    // Use the selected base year and the last year to compare
    const firstYear = fromYear
    const lastYear = YEARS[YEARS.length - 1]
    
    // Skip calculation if base year is the last year
    if (firstYear === lastYear) {
      setTrendData({})
      return
    }
    
    // Calculate sector trends
    const firstYearData = data[firstYear]
    const lastYearData = data[lastYear]
    
    if (!firstYearData?.sectors || !lastYearData?.sectors) return
    
    // Process each sector in the first year
    Object.entries(firstYearData.sectors).forEach(([sectorName, sectorData]) => {
      // Check if the sector exists in the last year
      if (lastYearData.sectors[sectorName]) {
        const firstYearValue = sectorData["Despesa Efetiva Consolidada"]["Execucao"]
        const lastYearValue = lastYearData.sectors[sectorName]["Despesa Efetiva Consolidada"]["Execucao"]
        
        const diff = lastYearValue - firstYearValue
        const percentChange = (diff / firstYearValue) * 100
        
        trends[sectorName] = {
          trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
          percentage: Math.abs(percentChange)
        }
        
        // Calculate subsector trends if they exist
        if (sectorData.Subsectors && lastYearData.sectors[sectorName].Subsectors) {
          Object.entries(sectorData.Subsectors).forEach(([subsectorName, subsectorData]) => {
            if (lastYearData.sectors[sectorName].Subsectors?.[subsectorName]) {
              const firstYearSubValue = subsectorData["Execucao"]
              const lastYearSubValue = lastYearData.sectors[sectorName].Subsectors?.[subsectorName]["Execucao"]
              
              const subDiff = lastYearSubValue - firstYearSubValue
              const subPercentChange = (subDiff / firstYearSubValue) * 100
              
              trends[subsectorName] = {
                trend: subDiff > 0 ? 'up' : subDiff < 0 ? 'down' : 'neutral',
                percentage: Math.abs(subPercentChange)
              }
            }
          })
        }
      }
    })
    
    setTrendData(trends)
  }
  
  // Get the trend icon for a given entity
  const getTrendIcon = (name: string) => {
    const trend = trendData[name]
    if (!trend) return null
    
    return (
      <div className="flex items-center gap-1 ml-1" title={`${trend.percentage.toFixed(1)}% ${trend.trend === 'up' ? 'increase' : 'decrease'} since ${baseYear}`}>
        {trend.trend === 'up' && <ArrowUpIcon className="h-3 w-3 text-green-500" />}
        {trend.trend === 'down' && <ArrowDownIcon className="h-3 w-3 text-red-500" />}
        {trend.trend === 'neutral' && <MinusIcon className="h-3 w-3 text-gray-500" />}
      </div>
    )
  }
  
  // Get the trend percentage for a given entity
  const getTrendPercentage = (name: string) => {
    const trend = trendData[name]
    if (!trend) return null
    
    return (
      <div className="text-xs text-muted-foreground mt-0.5">
        {trend.percentage.toFixed(1)}%
      </div>
    )
  }
  
  // Update subsectors when sector changes
  useEffect(() => {
    if (!selectedSector || !yearData || Object.keys(yearData).length === 0) {
      setSubsectors([])
      setSelectedSubsectors([])
      return
    }
    
    // Find the selected sector in the latest year
    const latestYear = YEARS[YEARS.length - 1]
    const sectorData = yearData[latestYear]?.sectors[selectedSector]
    
    if (sectorData?.Subsectors) {
      // Get all subsector names, excluding special entries
      const subsectorNames = Object.keys(sectorData.Subsectors)
        .filter(name => 
          name !== "DESPESA TOTAL NÃO CONSOLIDADA" && 
          name !== "DESPESA TOTAL CONSOLIDADA"
        )
      setSubsectors(subsectorNames)
      
      // Reset selected subsectors
      setSelectedSubsectors([])
    } else {
      setSubsectors([])
      setSelectedSubsectors([])
    }
  }, [selectedSector, yearData])
  
  // Prepare data for the chart
  const chartData = YEARS.map(year => {
    const yearDataObj = yearData[year]
    if (!yearDataObj?.sectors) return { year }
    
    // Start with the year as the base object
    const dataPoint: Record<string, any> = {
      year,
      // Calculate total budget as a sum of all sector executions
      Total: (Object.values(yearDataObj.sectors).reduce((acc, sector) => 
        acc + sector["Despesa Efetiva Consolidada"]["Execucao"], 0) / 1000).toFixed(2), // Convert to billions
    }
    
    // If no sector is selected, show totals for all sectors
    if (!selectedSector) {
      sectors.forEach(sectorName => {
        const sectorData = yearDataObj?.sectors[sectorName]
        
        if (sectorData && sectorData["Despesa Efetiva Consolidada"]) {
          if (selectedType === 'absolute') {
            // Convert to billions and store as number for the graph
            dataPoint[sectorName] = Number((sectorData["Despesa Efetiva Consolidada"]["Execucao"] / 1000).toFixed(2))
          } else {
            // Calculate percentage of total budget
            const totalBudget = Object.values(yearDataObj.sectors).reduce((acc, sector) => 
              acc + sector["Despesa Efetiva Consolidada"]["Execucao"], 0)
            const percentage = (sectorData["Despesa Efetiva Consolidada"]["Execucao"] / totalBudget) * 100
            dataPoint[sectorName] = Number(percentage.toFixed(2)) // Store as number for the graph
          }
        }
      })
    } 
    // If a sector is selected but no subsectors, show sector total
    else if (selectedSector && selectedSubsectors.length === 0 && !showAllSubsectors) {
      const sectorData = yearDataObj?.sectors[selectedSector]
      
      if (sectorData && sectorData["Despesa Efetiva Consolidada"]) {
        if (selectedType === 'absolute') {
          // Convert to billions and store as number for the graph
          dataPoint[selectedSector] = Number((sectorData["Despesa Efetiva Consolidada"]["Execucao"] / 1000).toFixed(2))
        } else {
          // Calculate percentage of total budget
          const totalBudget = Object.values(yearDataObj.sectors).reduce((acc, sector) => 
            acc + sector["Despesa Efetiva Consolidada"]["Execucao"], 0)
          const percentage = (sectorData["Despesa Efetiva Consolidada"]["Execucao"] / totalBudget) * 100
          dataPoint[selectedSector] = Number(percentage.toFixed(2)) // Store as number for the graph
        }
      }
    }
    // If showing all subsectors or specific subsectors
    else if (selectedSector) {
      const sectorData = yearDataObj?.sectors[selectedSector]
      
      if (sectorData && sectorData["Despesa Efetiva Consolidada"]) {
        // Add sector total
        if (selectedType === 'absolute') {
          // Convert to billions and store as number for the graph
          dataPoint[selectedSector] = Number((sectorData["Despesa Efetiva Consolidada"]["Execucao"] / 1000).toFixed(2))
        } else {
          // Calculate percentage of total budget
          const totalBudget = Object.values(yearDataObj.sectors).reduce((acc, sector) => 
            acc + sector["Despesa Efetiva Consolidada"]["Execucao"], 0)
          const percentage = (sectorData["Despesa Efetiva Consolidada"]["Execucao"] / totalBudget) * 100
          dataPoint[selectedSector] = Number(percentage.toFixed(2)) // Store as number for the graph
        }
        
        // Add subsector data if available
        if (sectorData.Subsectors) {
          const subsectorsToShow = showAllSubsectors ? 
            Object.keys(sectorData.Subsectors).filter(name => 
              name !== "DESPESA TOTAL NÃO CONSOLIDADA" && 
              name !== "DESPESA TOTAL CONSOLIDADA"
            ) : 
            selectedSubsectors
          
          subsectorsToShow.forEach(subName => {
            const subsector = sectorData.Subsectors?.[subName]
            if (subsector) {
              if (selectedType === 'absolute') {
                // Convert to billions and store as number for the graph
                dataPoint[subName] = Number((subsector["Execucao"] / 1000).toFixed(2))
              } else {
                // Calculate percentage of sector budget
                const sectorBudget = sectorData["Despesa Efetiva Consolidada"]["Execucao"]
                const percentage = (subsector["Execucao"] / sectorBudget) * 100
                dataPoint[subName] = Number(percentage.toFixed(2)) // Store as number for the graph
              }
            }
          })
        }
      }
    }
    
    return dataPoint
  })
  
  // Toggle subsector selection
  const toggleSubsector = (subsector: string) => {
    setSelectedSubsectors(prev => 
      prev.includes(subsector)
        ? prev.filter(s => s !== subsector)
        : [...prev, subsector]
    )
  }
  
  // Get formatted label for Y axis
  const getYAxisLabel = () => {
    return selectedType === 'absolute' 
      ? "Orçamento (€ Mil Milhões)" 
      : "Percentagem do Orçamento Total (%)"
  }
  
  // Get items to display in the legend
  const getLineItems = () => {
    if (!selectedSector) {
      return sectors
    } else if (selectedSubsectors.length === 0 && !showAllSubsectors) {
      return [selectedSector]
    } else {
      const items = [selectedSector]
      const subList = showAllSubsectors ? subsectors : selectedSubsectors
      return [...items, ...subList]
    }
  }

  // Calculate the chart height based on the number of legend items
  const calculateChartHeight = () => {
    const lineItems = getLineItems();
    // Base height plus additional height for each item beyond a threshold
    const baseHeight = 400;
    const threshold = 6; // Lower threshold for sectors (was 8)
    const additionalHeightPerItem = 30; // More height per item (was 20)
    
    if (lineItems.length > threshold) {
      return baseHeight + (lineItems.length - threshold) * additionalHeightPerItem;
    }
    return baseHeight;
  }

  // Add a custom tooltip component to sort items
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Sort payload by value in descending order
      const sortedPayload = [...payload].sort((a, b) => {
        return parseFloat(b.value) - parseFloat(a.value);
      });

      return (
        <div className="bg-background border p-2 rounded-md shadow-md">
          <p className="font-medium">{`Ano: ${label}`}</p>
          {sortedPayload.map((entry, index) => {
            const isSector = entry.name === selectedSector;
            const unit = selectedType === 'absolute' ? '€MM' : '%';
            
            return (
              <div key={`item-${index}`} className="flex justify-between gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className={`text-sm ${isSector ? 'font-medium' : ''}`}>
                    {toProperCase(entry.name)}
                  </span>
                </div>
                <span className="text-sm font-mono">
                  {entry.value} {unit}
                </span>
              </div>
            );
          })}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        <span>A carregar dados de tendências por setor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4">
        <p className="text-sm text-red-800">Erro ao carregar dados: {error}</p>
      </div>
    )
  }

  // Calculate years available for base year selection (excluding the latest year)
  const baseYearOptions = YEARS.slice(0, -1);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        {/* Left side: Sector selection and chart type */}
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-2">
          <Select 
            value={selectedSector || "all"} 
            onValueChange={(value) => {
              setSelectedSector(value === "all" ? null : value)
              setSelectedSubsectors([])
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os Setores</SelectItem>
                {sectors.map(sector => (
                  <SelectItem key={sector} value={sector}>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {toProperCase(sector)}
                        {getTrendIcon(sector)}
                      </div>
                      {getTrendPercentage(sector)}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedType === 'absolute' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('absolute')}
            >
              Valores €
            </Button>
            <Button 
              variant={selectedType === 'percentage' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('percentage')}
            >
              Percentagem
            </Button>
          </div>
        </div>
        
        {/* Right side: Show all subsectors checkbox */}
        <div className="flex items-center space-x-2">
          {selectedSector && subsectors.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-all-subsectors"
                checked={showAllSubsectors}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setShowAllSubsectors(checked)
                    if (checked) {
                      // Clear manual selections when showing all
                      setSelectedSubsectors([])
                    }
                  }
                }}
              />
              <Label htmlFor="show-all-subsectors">Mostrar todos os subsetores</Label>
            </div>
          )}
        </div>
      </div>
      
      {selectedSector && subsectors.length > 0 && (
        <div className={getSubsectorSelectionClasses()}>
          <p className="text-sm text-muted-foreground">Selecionar subsetores para comparar:</p>
          <div className="flex flex-wrap gap-1">
            {subsectors.map(subsector => (
              <Badge
                key={subsector}
                variant={selectedSubsectors.includes(subsector) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleSubsector(subsector)}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    {toProperCase(subsector)}
                    {getTrendIcon(subsector)}
                  </div>
                  {getTrendPercentage(subsector)}
                </div>
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ height: `${calculateChartHeight()}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              label={{ 
                value: selectedType === 'absolute' ? "Orçamento (€ Mil Milhões)" : "Percentagem do Orçamento Total (%)", 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value, entry) => (
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <span>{toProperCase(value)}</span>
                    {getTrendIcon(value)}
                  </div>
                  {getTrendPercentage(value)}
                </div>
              )}
            />
            
            {/* Render lines for each selected item */}
            {getLineItems().map((item, index) => (
              <Line
                key={item}
                type="monotone"
                dataKey={item}
                name={item}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={item === selectedSector ? 2 : 1.5}
                dot={true}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-2 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 mr-4">
          <Label htmlFor="trend-base-year" className="text-sm whitespace-nowrap">Comparar com:</Label>
          <Select 
            value={baseYear} 
            onValueChange={setBaseYear}
          >
            <SelectTrigger id="trend-base-year" className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {baseYearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
          <span>Aumentou</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
          <span>Diminuiu</span>
        </div>
        <div className="flex items-center gap-1">
          <MinusIcon className="h-4 w-4 text-gray-500" />
          <span>Sem alteração significativa</span>
        </div>
      </div>
    </div>
  )
}
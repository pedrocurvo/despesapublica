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
const YEARS = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]

type DistrictData = {
  District: string
  Total: number
  NationalPercentage: string
}

type MunicipalityData = {
  [municipalityName: string]: number
}

type TransferData = {
  Total: number
  Year: string
  Districts: Array<{
    District: string
    Total: number
    NationalPercentage: string
    Municipalities?: Record<string, number>
  }>
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

export function DistrictTrends() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [yearData, setYearData] = useState<Record<string, TransferData>>({})
  const [districts, setDistricts] = useState<string[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [municipalities, setMunicipalities] = useState<string[]>([])
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([])
  const [showAllMunicipalities, setShowAllMunicipalities] = useState(false)
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

  // Fetch data for all years
  useEffect(() => {
    const fetchAllYearData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result: Record<string, TransferData> = {}
        
        // Fetch data for each year
        for (const year of YEARS) {
          const response = await fetch(`/api/transfers?year=${year}&level=municipality`)
          
          if (!response.ok) {
            throw new Error(`Failed to load data for ${year}`)
          }
          
          const data = await response.json()
          result[year] = data
        }
        
        setYearData(result)
        
        // Extract all district names from the first year's data
        const districtNames = result[YEARS[0]]?.Districts.map(d => d.District) || []
        setDistricts(districtNames)
        
        // Calculate trends for districts and municipalities
        calculateTrends(result, baseYear)
        
        setLoading(false)
      } catch (err) {
        console.error("Error fetching transfer data:", err)
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
  
  // Calculate trends for districts and municipalities
  const calculateTrends = (data: Record<string, TransferData>, fromYear: string) => {
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
    
    // Calculate district trends
    data[firstYear]?.Districts.forEach(district => {
      const districtName = district.District
      const firstYearValue = district.Total
      
      // Find the same district in the last year
      const lastYearDistrict = data[lastYear]?.Districts.find(
        d => d.District === districtName
      )
      
      if (lastYearDistrict) {
        const lastYearValue = lastYearDistrict.Total
        const diff = lastYearValue - firstYearValue
        const percentChange = (diff / firstYearValue) * 100
        
        trends[districtName] = {
          trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
          percentage: Math.abs(percentChange)
        }
        
        // Calculate trends for municipalities if they exist
        if (district.Municipalities && lastYearDistrict.Municipalities) {
          Object.entries(district.Municipalities).forEach(([muniName, muniValue]) => {
            const lastYearMuniValue = lastYearDistrict.Municipalities?.[muniName]
            
            if (lastYearMuniValue !== undefined) {
              const muniDiff = lastYearMuniValue - muniValue
              const muniPercentChange = (muniDiff / muniValue) * 100
              
              trends[muniName] = {
                trend: muniDiff > 0 ? 'up' : muniDiff < 0 ? 'down' : 'neutral',
                percentage: Math.abs(muniPercentChange)
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
  
  // Update municipalities when district changes
  useEffect(() => {
    if (!selectedDistrict || !yearData || Object.keys(yearData).length === 0) {
      setMunicipalities([])
      setSelectedMunicipalities([])
      return
    }
    
    // Find the selected district in the latest year
    const latestYear = YEARS[YEARS.length - 1]
    const district = yearData[latestYear]?.Districts.find(
      d => d.District === selectedDistrict
    )
    
    if (district?.Municipalities) {
      const municipalityNames = Object.keys(district.Municipalities)
      setMunicipalities(municipalityNames)
      
      // Reset selected municipalities
      setSelectedMunicipalities([])
    } else {
      setMunicipalities([])
      setSelectedMunicipalities([])
    }
  }, [selectedDistrict, yearData])
  
  // Prepare data for the chart
  const chartData = YEARS.map(year => {
    const yearDataObj = yearData[year] || { Total: 0, Districts: [] }
    
    // Start with the year as the base object
    const dataPoint: Record<string, any> = {
      year,
      Total: (yearDataObj.Total / 1000000000).toFixed(2), // Convert to billions
    }
    
    // If no district is selected, show totals for all selected districts
    if (!selectedDistrict) {
      districts.forEach(districtName => {
        const district = yearDataObj.Districts.find(d => d.District === districtName)
        if (district) {
          if (selectedType === 'absolute') {
            dataPoint[districtName] = (district.Total / 1000000000).toFixed(2) // Convert to billions
          } else {
            dataPoint[districtName] = Number(district.NationalPercentage).toFixed(2) // Percentage
          }
        }
      })
    } 
    // If a district is selected but no municipalities, show district total
    else if (selectedDistrict && selectedMunicipalities.length === 0 && !showAllMunicipalities) {
      const district = yearDataObj.Districts.find(d => d.District === selectedDistrict)
      if (district) {
        if (selectedType === 'absolute') {
          dataPoint[selectedDistrict] = (district.Total / 1000000000).toFixed(2) // Convert to billions
        } else {
          dataPoint[selectedDistrict] = Number(district.NationalPercentage).toFixed(2) // Percentage
        }
      }
    } 
    // If showing all municipalities or specific municipalities
    else {
      const district = yearDataObj.Districts.find(d => d.District === selectedDistrict)
      if (district?.Municipalities) {
        // Add district total if requested
        if (selectedType === 'absolute') {
          dataPoint[selectedDistrict] = (district.Total / 1000000000).toFixed(2) // Convert to billions
        } else {
          dataPoint[selectedDistrict] = Number(district.NationalPercentage).toFixed(2) // Percentage
        }

        // Add municipality data
        const municipalitiesToShow = showAllMunicipalities 
          ? Object.keys(district.Municipalities) 
          : selectedMunicipalities
        
        municipalitiesToShow.forEach(muni => {
          if (district.Municipalities && district.Municipalities[muni]) {
            if (selectedType === 'absolute') {
              dataPoint[muni] = (district.Municipalities[muni] / 1000000).toFixed(2) // Convert to millions
            } else {
              dataPoint[muni] = ((district.Municipalities[muni] / yearDataObj.Total) * 100).toFixed(2) // Calculate percentage
            }
          }
        })
      }
    }
    
    return dataPoint
  })
  
  // Toggle municipality selection
  const toggleMunicipality = (municipality: string) => {
    setSelectedMunicipalities(prev => 
      prev.includes(municipality)
        ? prev.filter(m => m !== municipality)
        : [...prev, municipality]
    )
  }
  
  // Get formatted label for Y axis
  const getYAxisLabel = () => {
    return selectedType === 'absolute' 
      ? "Orçamento (€ Mil Milhões)" 
      : "Percentagem do Orçamento Nacional (%)"
  }
  
  // Get items to display in the legend
  const getLineItems = () => {
    if (!selectedDistrict) {
      return districts
    } else if (selectedMunicipalities.length === 0 && !showAllMunicipalities) {
      return [selectedDistrict]
    } else {
      const items = [selectedDistrict]
      const municList = showAllMunicipalities ? municipalities : selectedMunicipalities
      return [...items, ...municList]
    }
  }

  // Calculate the chart height based on the number of legend items
  const calculateChartHeight = () => {
    const lineItems = getLineItems();
    // Base height plus additional height for each item beyond a threshold
    const baseHeight = 400;
    const threshold = 8; // Number of items before we start expanding
    const additionalHeightPerItem = 20; // pixels per additional item
    
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
            const isDistrict = entry.name === selectedDistrict;
            const unit = selectedType === 'absolute' 
              ? (isDistrict ? '€B' : '€M') 
              : '%';
            
            return (
              <div key={`item-${index}`} className="flex justify-between gap-4 items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className={`text-sm ${isDistrict ? 'font-medium' : ''}`}>
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
        <span>A carregar dados de tendências por distrito...</span>
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
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-2">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
          <Select 
            value={selectedDistrict || "all"} 
            onValueChange={(value) => {
              setSelectedDistrict(value === "all" ? null : value)
              setSelectedMunicipalities([])
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar distrito" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os Distritos</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        {toProperCase(district)}
                        {getTrendIcon(district)}
                      </div>
                      {getTrendPercentage(district)}
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
        
        <div className="flex items-center space-x-2">
          {selectedDistrict && municipalities.length > 0 && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-all-municipalities"
                checked={showAllMunicipalities}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setShowAllMunicipalities(checked)
                    if (checked) {
                      // Clear manual selections when showing all
                      setSelectedMunicipalities([])
                    }
                  }
                }}
              />
              <Label htmlFor="show-all-municipalities">Mostrar todos os municípios</Label>
            </div>
          )}
        </div>
      </div>
      
      {selectedDistrict && municipalities.length > 0 && !showAllMunicipalities && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Selecionar municípios para comparar:</p>
          <div className="flex flex-wrap gap-1">
            {municipalities.map(municipality => (
              <Badge
                key={municipality}
                variant={selectedMunicipalities.includes(municipality) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleMunicipality(municipality)}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    {toProperCase(municipality)}
                    {getTrendIcon(municipality)}
                  </div>
                  {getTrendPercentage(municipality)}
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
                value: selectedType === 'absolute' ? "Orçamento (€ Mil Milhões)" : "Percentagem do Orçamento Nacional (%)", 
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
                strokeWidth={item === selectedDistrict ? 2 : 1.5}
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
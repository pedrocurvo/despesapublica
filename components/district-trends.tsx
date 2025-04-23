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
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Years to fetch data for
const YEARS = ["2021", "2022", "2023"]

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
        
        setLoading(false)
      } catch (err) {
        console.error("Error fetching transfer data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
        setLoading(false)
      }
    }
    
    fetchAllYearData()
  }, [])
  
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
      ? "Budget (€ Billions)" 
      : "Percentage of National Budget (%)"
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

  // Add a custom tooltip component to sort items
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Sort payload by value in descending order
      const sortedPayload = [...payload].sort((a, b) => {
        return parseFloat(b.value) - parseFloat(a.value);
      });

      return (
        <div className="bg-background border p-2 rounded-md shadow-md">
          <p className="font-medium">{`Year: ${label}`}</p>
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
                    {entry.name}
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
        <span>Loading district trend data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4">
        <p className="text-sm text-red-800">Error loading data: {error}</p>
      </div>
    )
  }

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
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map(district => (
                  <SelectItem key={district} value={district}>
                    {district}
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
              € Values
            </Button>
            <Button 
              variant={selectedType === 'percentage' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('percentage')}
            >
              Percentage
            </Button>
          </div>
        </div>
        
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
            <Label htmlFor="show-all-municipalities">Show all municipalities</Label>
          </div>
        )}
      </div>
      
      {selectedDistrict && municipalities.length > 0 && !showAllMunicipalities && (
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Select municipalities to compare:</p>
          <div className="flex flex-wrap gap-1">
            {municipalities.map(municipality => (
              <Badge
                key={municipality}
                variant={selectedMunicipalities.includes(municipality) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleMunicipality(municipality)}
              >
                {municipality}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              label={{ 
                value: getYAxisLabel(), 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
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
    </div>
  )
}
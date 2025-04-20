"use client"

import { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type DistrictInfo = {
  id: string
  name: string
  received: number
  nationalPercentage: number
}

type TransferData = {
  Total: number
  Districts: Array<{
    District: string
    Total: number
    NationalPercentage: string
    Municipalities: Record<string, number>
  }>
}

// Geographic centers for different regions
const projectionConfig = {
  mainland: {
    center: [-8.5, 39.5] as [number, number],
    scale: 5500,
  },
  madeira: {
    center: [-16.9, 32.7] as [number, number],
    scale: 8000,
  },
  azores: {
    center: [-28, 38.5] as [number, number],
    scale: 4000,
  }
}

// Helper function to determine if a district belongs to mainland, Madeira, or Azores
const getRegionType = (districtName: string): "mainland" | "madeira" | "azores" => {
  if (districtName.toLowerCase().includes("madeira") || districtName === "MADEIRA") {
    return "madeira"
  } else if (districtName.toLowerCase().includes("açores") || districtName.toLowerCase().includes("azores") || districtName === "AÇORES") {
    return "azores"
  }
  return "mainland"
}

// Normalize district names for comparison to ensure consistent matching
const normalizeDistrictName = (name: string): string => {
  // Handle special cases for autonomous regions
  if (name.toLowerCase().includes("madeira") || name === "MADEIRA") {
    return "MADEIRA";
  } else if (name.toLowerCase().includes("açores") || name.toLowerCase().includes("azores") || name === "AÇORES") {
    return "AÇORES";
  }
  return name;
}

interface PortugalMapProps {
  selectedYear: string;
}

export function PortugalMap({ selectedYear }: PortugalMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [hoveredMunicipality, setHoveredMunicipality] = useState<string | null>(null)
  const [municipalityData, setMunicipalityData] = useState<{
    name: string;
    received: number;
    districtPercentage: number;
    nationalPercentage: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [geoData, setGeoData] = useState<any>(null)
  const [municipalitiesData, setMunicipalitiesData] = useState<any>(null)
  const [transferData, setTransferData] = useState<TransferData | null>(null)

  // URLs for GeoJSON files
  const districtGeoUrl = "gadm41_PRT_1.json"
  const municipalitiesGeoUrl = "gadm41_PRT_2.json"

  const handleMouseEnter = (districtId: string, districtName: string, e: React.MouseEvent) => {
    if (transferData) {
      const districtData = transferData.Districts.find(
        d => d.District.toUpperCase() === districtName.toUpperCase()
      );

      if (districtData) {
        setHoveredDistrict({
          id: districtId,
          name: districtName,
          received: Number(districtData.Total) / 1000000000, // Convert to billions
          nationalPercentage: Number(districtData.NationalPercentage)
        });
        
        setTooltipPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    }
  }

  const handleMunicipalityMouseEnter = (municipalityName: string, districtName: string, e: React.MouseEvent) => {
    if (transferData) {
      // Normalize district name for API data comparison
      const apiDistrictName = normalizeDistrictName(districtName);
      
      // Find the district data - for autonomous regions, we use the normalized name
      const districtData = transferData.Districts.find(
        d => {
          const dName = d.District.toUpperCase();
          return dName === apiDistrictName.toUpperCase() || 
                (apiDistrictName === "MADEIRA" && dName === "MADEIRA") || 
                (apiDistrictName === "AÇORES" && dName === "AÇORES");
        }
      );

      if (districtData && districtData.Municipalities) {
        // Find the municipality data
        const municipalityValue = districtData.Municipalities[municipalityName.toUpperCase()] || 0;
        
        if (municipalityValue) {
          // Calculate percentages
          const nationalPercentage = (municipalityValue / transferData.Total) * 100;
          const districtPercentage = (municipalityValue / districtData.Total) * 100;
          
          setMunicipalityData({
            name: municipalityName,
            received: municipalityValue / 1000000, // Convert to millions
            nationalPercentage,
            districtPercentage
          });
          
          setHoveredMunicipality(municipalityName);
          
          setTooltipPosition({
            x: e.clientX,
            y: e.clientY,
          });
        }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY,
    })
  }

  const handleMouseLeave = () => {
    setHoveredDistrict(null)
    setHoveredMunicipality(null)
    setMunicipalityData(null)
  }

  const handleDistrictClick = (districtName: string) => {
    // Normalize the district name for autonomous regions
    const normalizedName = normalizeDistrictName(districtName);
    setSelectedDistrict(normalizedName);
  }

  // Map district IDs from GeoJSON properties to our data format
  const mapDistrictId = (geoName: string): string => {
    // Map from GeoJSON district names to our district IDs
    const districtMap: Record<string, string> = {
      "Viana do Castelo": "viana-do-castelo",
      "Braga": "braga",
      "Vila Real": "vila-real",
      "Bragança": "braganca",
      "Porto": "porto",
      "Aveiro": "aveiro",
      "Viseu": "viseu",
      "Guarda": "guarda",
      "Coimbra": "coimbra",
      "Castelo Branco": "castelo-branco",
      "Leiria": "leiria",
      "Santarém": "santarem",
      "Portalegre": "portalegre",
      "Lisboa": "lisboa",
      "Setúbal": "setubal",
      "Évora": "evora",
      "Beja": "beja",
      "Faro": "faro",
      "Região Autónoma dos Açores": "azores",
      "Região Autónoma da Madeira": "madeira"
    }
    
    return districtMap[geoName] || geoName.toLowerCase().replace(/\s+/g, "-")
  }

  // Get the fill color based on the percentage of national budget
  const getDistrictFill = (districtName: string) => {
    if (!transferData) return "#e5e7eb" // Default gray
    
    // Normalize the district name for autonomous regions
    const normalizedName = normalizeDistrictName(districtName);
    
    // Find the district data
    const districtData = transferData.Districts.find(
      d => {
        return d.District.toUpperCase() === normalizedName.toUpperCase() || 
              (normalizedName === "MADEIRA" && d.District === "MADEIRA") || 
              (normalizedName === "AÇORES" && d.District === "AÇORES");
      }
    );
    
    if (!districtData) return "#e5e7eb" // Default gray

    const percentage = Number(districtData.NationalPercentage);
    
    // Color scale based on percentage
    if (percentage > 10) return "#0ea5e9" // High - blue
    if (percentage > 7) return "#60a5fa"  // Medium-high - lighter blue
    if (percentage > 4) return "#93c5fd"  // Medium - even lighter blue
    return "#bfdbfe"                       // Low - lightest blue
  }

  // Get projection config for specific district
  const getDistrictProjectionConfig = (districtName: string) => {
    // These are approximate centers for districts
    const districtCenters: Record<string, { center: [number, number], scale: number }> = {
      "Aveiro": { center: [-8.6, 40.7], scale: 15000 },
      "Beja": { center: [-7.9, 38.0], scale: 12000 },
      "Braga": { center: [-8.4, 41.5], scale: 15000 },
      "Bragança": { center: [-6.8, 41.8], scale: 12000 },
      "Castelo Branco": { center: [-7.5, 40.0], scale: 12000 },
      "Coimbra": { center: [-8.3, 40.2], scale: 15000 },
      "Évora": { center: [-7.9, 38.6], scale: 12000 },
      "Faro": { center: [-7.9, 37.0], scale: 12000 },
      "Guarda": { center: [-7.2, 40.6], scale: 12000 },
      "Leiria": { center: [-8.8, 39.7], scale: 12000 },
      "Lisboa": { center: [-9.1, 38.7], scale: 20000 },
      "Portalegre": { center: [-7.4, 39.3], scale: 12000 },
      "Porto": { center: [-8.3, 41.1], scale: 20000 },
      "Santarém": { center: [-8.5, 39.2], scale: 12000 },
      "Setúbal": { center: [-8.9, 38.5], scale: 12000 },
      "Viana do Castelo": { center: [-8.6, 41.7], scale: 15000 },
      "Vila Real": { center: [-7.7, 41.3], scale: 12000 },
      "Viseu": { center: [-7.9, 40.7], scale: 12000 },
      // Include centers for islands if needed
      "Região Autónoma da Madeira": projectionConfig.madeira,
      "MADEIRA": projectionConfig.madeira,
      "Região Autónoma dos Açores": projectionConfig.azores,
      "AÇORES": projectionConfig.azores,
    }
    
    return districtCenters[districtName] || projectionConfig.mainland
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Load district-level GeoJSON data
    fetch(districtGeoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load district GeoJSON: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setGeoData(data);
      })
      .catch(err => {
        console.error("Error loading district GeoJSON:", err);
        setError(`Failed to load map data: ${err.message}`);
      });
    
    // Load municipality-level GeoJSON data
    fetch(municipalitiesGeoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load municipalities GeoJSON: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setMunicipalitiesData(data);
      })
      .catch(err => {
        console.error("Error loading municipalities GeoJSON:", err);
      });

    // Fetch transfer data with municipality level information
    fetch(`/api/transfers?year=${selectedYear}&level=municipality`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load transfer data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setTransferData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading transfer data:", err);
        setError(`Failed to load transfer data: ${err.message}`);
        setLoading(false);
      });
  }, [districtGeoUrl, municipalitiesGeoUrl, selectedYear]);

  // Create geography components with appropriate filtering for district level
  const renderGeographies = (regionType: "mainland" | "madeira" | "azores") => {
    if (!geoData) return null;
    
    return (
      <Geographies geography={geoData}>
        {({ geographies }) => {
          // Filter geographies based on region type
          const filteredGeos = geographies.filter(geo => {
            const districtName = geo.properties.NAME_1 || "";
            return getRegionType(districtName) === regionType;
          });
          
          return filteredGeos.map((geo) => {
            const { NAME_1 } = geo.properties;
            const districtId = mapDistrictId(NAME_1);
            
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={getDistrictFill(NAME_1)}
                stroke="#94a3b8"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#38bdf8" },
                  pressed: { outline: "none", fill: "#38bdf8" },
                }}
                onClick={() => handleDistrictClick(NAME_1)}
                onMouseEnter={(e) => handleMouseEnter(districtId, NAME_1, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer transition-colors"
              />
            );
          });
        }}
      </Geographies>
    );
  };

  // Render municipalities for a specific district
  const renderMunicipalities = (districtName: string) => {
    if (!municipalitiesData) return null;
    console.log("Selected District:", districtName);
    
    // Normalize district name for comparison with GeoJSON properties
    const normalizedDistrictName = normalizeDistrictName(districtName);
    console.log("Normalized District Name:", normalizedDistrictName);
    
    return (
      <Geographies geography={municipalitiesData}>
        {({ geographies }) => {
          // Filter for municipalities in the selected district
          const filteredGeos = geographies.filter(geo => {
            // For Madeira and Açores, we need special handling
            if (normalizedDistrictName === "MADEIRA" && (
              geo.properties.NAME_1.toLowerCase().includes("madeira") ||
              geo.properties.NAME_1 === "Região Autónoma da Madeira"
            )) {
              return true;
            }
            if (normalizedDistrictName === "AÇORES" && (
              geo.properties.NAME_1.toLowerCase().includes("açores") || 
              geo.properties.NAME_1.toLowerCase().includes("azores") ||
              geo.properties.NAME_1 === "Região Autónoma dos Açores"
            )) {
              return true;
            }
            // For mainland districts, use exact match
            return geo.properties.NAME_1 === districtName;
          });
          
          return filteredGeos.map((geo) => {
            const { NAME_1, NAME_2 } = geo.properties;
            
            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#93c5fd"
                stroke="#ffffff"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#38bdf8" },
                  pressed: { outline: "none", fill: "#38bdf8" },
                }}
                onMouseEnter={(e) => handleMunicipalityMouseEnter(NAME_2, NAME_1, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer transition-colors"
              />
            );
          });
        }}
      </Geographies>
    );
  };

  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium">
          {selectedDistrict ? `${selectedDistrict === "AÇORES" ? "Açores" : selectedDistrict === "MADEIRA" ? "Madeira" : selectedDistrict} Municipalities` : `Budget Distribution by District (${selectedYear})`}
        </div>
        
        {selectedDistrict ? (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSelectedDistrict(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to National View</span>
          </Button>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#bfdbfe]"></div>
              <span className="text-xs">{"< 4%"}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#93c5fd]"></div>
              <span className="text-xs">4% - 7%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#60a5fa]"></div>
              <span className="text-xs">7% - 10%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-[#0ea5e9]"></div>
              <span className="text-xs">{"> 10%"}</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative w-full">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Make sure the file exists at: <code>public/{selectedDistrict ? municipalitiesGeoUrl : districtGeoUrl}</code>
            </p>
          </div>
        )}
        
        {loading ? (
          <div className="flex h-[600px] items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-2">Loading map data...</p>
            </div>
          </div>
        ) : !error && (selectedDistrict ? municipalitiesData : geoData) && (
          <>
            {selectedDistrict ? (
              // Render detailed district view with municipalities
              <div className="border rounded-lg p-2 shadow-sm">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={getDistrictProjectionConfig(selectedDistrict)}
                  width={800}
                  height={600}
                  style={{ width: "100%", height: "auto" }}
                >
                  <ZoomableGroup>
                    {renderMunicipalities(selectedDistrict)}
                  </ZoomableGroup>
                </ComposableMap>
              </div>
            ) : (
              // Render national map with districts
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Portugal Map */}
                <div className="md:col-span-2">
                  <div className="border rounded-lg p-2 shadow-sm">
                    <h3 className="text-sm font-medium mb-2">Mainland Portugal</h3>
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={projectionConfig.mainland}
                      width={600}
                      height={800}
                      style={{ width: "100%", height: "auto" }}
                    >
                      <ZoomableGroup>
                        {renderGeographies("mainland")}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                </div>
                
                {/* Islands Maps */}
                <div className="md:col-span-1 space-y-4">
                  {/* Madeira Map */}
                  <div className="border rounded-lg p-2 shadow-sm">
                    <h3 className="text-sm font-medium mb-2">Madeira</h3>
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={projectionConfig.madeira}
                      width={300}
                      height={300}
                      style={{ width: "100%", height: "auto" }}
                    >
                      <ZoomableGroup>
                        {renderGeographies("madeira")}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                  
                  {/* Azores Map */}
                  <div className="border rounded-lg p-2 shadow-sm">
                    <h3 className="text-sm font-medium mb-2">Açores</h3>
                    <ComposableMap
                      projection="geoMercator"
                      projectionConfig={projectionConfig.azores}
                      width={300}
                      height={300}
                      style={{ width: "100%", height: "auto" }}
                    >
                      <ZoomableGroup>
                        {renderGeographies("azores")}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!selectedDistrict && hoveredDistrict && (
          <Card
            className="absolute z-10 w-64 shadow-lg"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <CardContent className="p-4">
              <h3 className="mb-2 font-medium">{hoveredDistrict.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Received:</div>
                <div className="font-medium text-right">€{hoveredDistrict.received.toFixed(2)}B</div>
                <div className="text-muted-foreground">National %:</div>
                <div className="font-medium text-right">{hoveredDistrict.nationalPercentage.toFixed(2)}%</div>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedDistrict && hoveredMunicipality && municipalityData && (
          <Card
            className="absolute z-10 w-64 shadow-lg"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y + 10}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <CardContent className="p-4">
              <h3 className="mb-2 font-medium">{municipalityData.name}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Received:</div>
                <div className="font-medium text-right">€{municipalityData.received.toFixed(2)}M</div>
                <div className="text-muted-foreground">District %:</div>
                <div className="font-medium text-right">{municipalityData.districtPercentage.toFixed(2)}%</div>
                <div className="text-muted-foreground">National %:</div>
                <div className="font-medium text-right">{municipalityData.nationalPercentage.toFixed(2)}%</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

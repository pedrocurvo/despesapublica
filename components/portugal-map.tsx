"use client"

import { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps"
import { Card, CardContent } from "@/components/ui/card"
import { districtData } from "@/lib/district-data"

type DistrictInfo = {
  id: string
  name: string
  received: number
  contributed: number
  expended: number
}

// Geographic centers for different regions
const projectionConfig = {
  mainland: {
    center: [-8.5, 39.5],
    scale: 5500,
  },
  madeira: {
    center: [-16.9, 32.7],
    scale: 8000,
  },
  azores: {
    center: [-28, 38.5],
    scale: 4000,
  }
}

// Helper function to determine if a district belongs to mainland, Madeira, or Azores
const getRegionType = (districtName: string): "mainland" | "madeira" | "azores" => {
  if (districtName.toLowerCase().includes("madeira")) {
    return "madeira"
  } else if (districtName.toLowerCase().includes("açores") || districtName.toLowerCase().includes("azores")) {
    return "azores"
  }
  return "mainland"
}

export function PortugalMap() {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictInfo | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [geoData, setGeoData] = useState<any>(null)

  // Use direct import for GeoJSON to ensure it's available
  const geoUrl = "gadm41_PRT_1.json"

  const handleMouseEnter = (districtId: string, e: React.MouseEvent) => {
    const district = districtData["2023"].find((d) => d.id === districtId)
    if (district) {
      setHoveredDistrict(district)
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY,
      })
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

  // Get the fill color based on the received amount
  const getDistrictFill = (districtId: string) => {
    const district = districtData["2023"].find((d) => d.id === districtId)
    if (!district) return "#e5e7eb" // Default gray

    // Color scale based on received amount
    if (district.received > 2.0) return "#0ea5e9" // High - blue
    if (district.received > 1.0) return "#60a5fa" // Medium-high - lighter blue
    if (district.received > 0.5) return "#93c5fd" // Medium - even lighter blue
    return "#bfdbfe" // Low - lightest blue
  }

  useEffect(() => {
    // Check if the file exists
    fetch(geoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading GeoJSON:", err);
        setError(`Failed to load map data: ${err.message}`);
        setLoading(false);
      });
  }, [geoUrl]);

  // Create geography components with appropriate filtering
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
                fill={getDistrictFill(districtId)}
                stroke="#94a3b8"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#38bdf8" },
                  pressed: { outline: "none", fill: "#38bdf8" },
                }}
                onMouseEnter={(e) => {
                  const district = districtData["2023"].find((d) => d.id === districtId);
                  if (district) {
                    handleMouseEnter(districtId, e);
                  }
                }}
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
        <div className="text-sm font-medium">Budget Distribution by District (2023)</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#bfdbfe]"></div>
            <span className="text-xs">{"< €0.5B"}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#93c5fd]"></div>
            <span className="text-xs">€0.5B - €1.0B</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#60a5fa]"></div>
            <span className="text-xs">€1.0B - €2.0B</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-[#0ea5e9]"></div>
            <span className="text-xs">{"> €2.0B"}</span>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-800">
            <p>{error}</p>
            <p className="mt-2 text-sm">
              Make sure the file exists at: <code>public{geoUrl}</code>
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
        ) : !error && geoData && (
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

        {hoveredDistrict && (
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
                <div className="text-muted-foreground">Contributed:</div>
                <div className="font-medium text-right">€{hoveredDistrict.contributed.toFixed(2)}B</div>
                <div className="text-muted-foreground">Expended:</div>
                <div className="font-medium text-right">€{hoveredDistrict.expended.toFixed(2)}B</div>
                <div className="text-muted-foreground">Balance:</div>
                <div
                  className={`font-medium text-right ${
                    hoveredDistrict.received - hoveredDistrict.contributed > 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  €{(hoveredDistrict.received - hoveredDistrict.contributed).toFixed(2)}B
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
// Import the GeoJSON directly if fetch is causing issues
import defaultGeoData from "@/custom.geo.json";

interface BudgetDataItem {
  predicted: number;
  expended: number;
}

interface DistrictBudgetData {
  [districtId: string]: BudgetDataItem;
}

interface YearBudgetData {
  [year: string]: DistrictBudgetData;
}

interface PortugalGeoMapProps {
  selectedYear: string;
  budgetData: YearBudgetData;
}

export function PortugalGeoMap({ selectedYear = "2023", budgetData }: PortugalGeoMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");
  const [geoData, setGeoData] = useState<any>(defaultGeoData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);

  // Attempt to fetch the more detailed GeoJSON from public folder
  useEffect(() => {
    setLoading(true);
    fetch("/gadm41_PRT_1.json") // Correct path - files in public/ are served at the root
      .then((res) => {
        if (!res.ok) {
          console.error(`Failed to fetch GADM data: ${res.status} ${res.statusText}`);
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("GADM data loaded successfully", { 
          type: data.type, 
          featureCount: data.features?.length || 'unknown' 
        });
        setGeoData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading GADM GeoJSON:", err);
        setError("Failed to load district map data. Using fallback map.");
        // Keep using the default imported geoData
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="relative border rounded-lg shadow-sm overflow-hidden" style={{ minHeight: "500px" }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-10">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-amber-100 text-amber-800 px-4 py-2 text-sm">
          {error}
        </div>
      )}
      
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          center: [-8.5, 39.5],
          scale: 5500,
        }}
        width={600}
        height={800}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Extract properties from the geometry - handle both GeoJSON formats
                const properties = geo.properties;
                const name = properties.NAME_1 || properties.name || properties.sovereignt || "Unknown";
                const id = properties.GID_1 || properties.id || properties.sov_a3 || geo.rsmKey;
                
                // Get budget data for this district and selected year (or use placeholder if not available)
                const districtBudget = budgetData[selectedYear]?.[id] || { predicted: 0, expended: 0 };
                
                return (
                  <Geography
                    key={id}
                    geography={geo}
                    fill={activeDistrict === id ? "#3b82f6" : "#e9ecef"}
                    stroke="#adb5bd"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#60a5fa" },
                      pressed: { outline: "none", fill: "#3b82f6" },
                    }}
                    onMouseEnter={() => {
                      setActiveDistrict(id);
                      setTooltipContent(`
                        <div class="p-2">
                          <h3 class="font-bold text-lg mb-2">${name}</h3>
                          <p class="mb-1"><span class="font-medium">Budget Predicted (${selectedYear}):</span> ${formatCurrency(districtBudget.predicted)}</p>
                          <p class="mb-1"><span class="font-medium">Budget Expended (${selectedYear}):</span> ${formatCurrency(districtBudget.expended)}</p>
                          <p class="text-sm ${districtBudget.expended > districtBudget.predicted ? 'text-red-500' : 'text-green-500'}">
                            ${districtBudget.expended > districtBudget.predicted 
                              ? `Over budget by ${formatCurrency(districtBudget.expended - districtBudget.predicted)}` 
                              : `Under budget by ${formatCurrency(districtBudget.predicted - districtBudget.expended)}`
                            }
                          </p>
                        </div>
                      `);
                    }}
                    onMouseLeave={() => {
                      setActiveDistrict(null);
                      setTooltipContent("");
                    }}
                    data-tooltip-id="district-tooltip"
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <Tooltip id="district-tooltip" html={tooltipContent} className="shadow-lg rounded-md" />
      
      <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-md text-xs z-20">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#e9ecef]" />
          <span>Region</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-[#60a5fa]" />
          <span>Highlighted</span>
        </div>
      </div>
    </div>
  );
}
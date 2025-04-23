"use client";

import { useEffect, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { Card, CardContent } from "@/components/ui/card";

interface PortugalGeoMapProps {
  year: string;
  data: Record<string, number>;
}

export function PortugalGeoMap({ year, data }: PortugalGeoMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    setIsMounted(true);

    // Load the GeoJSON data only on the client side
    fetch("/gadm41_PRT_1.json")
      .then((response) => response.json())
      .then((topology) => {
        const geojson = feature(topology, topology.objects.gadm41_PRT_1);
        setGeoData(geojson);
      })
      .catch((error) => console.error("Error loading the GeoJSON data:", error));
  }, []);

  // Display loading state during server-side rendering or initial client render
  if (!isMounted || !geoData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[400px] w-full flex items-center justify-center">
            <div className="text-sm text-muted-foreground">A carregar dados do mapa...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render the map with the district data
  return (
    <Card>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 960 500">
            {geoData.features.map((feature, i) => {
              const districtName = feature.properties.NAME_1;
              const value = data[districtName] || 0;
              // Color scale based on budget allocation
              const color = d3.interpolateBlues(value / 100);

              return (
                <g key={i}>
                  <path
                    d={d3.geoPath()(feature)}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={0.5}
                  />
                  <text
                    x={d3.geoCentroid(feature)[0]}
                    y={d3.geoCentroid(feature)[1]}
                    textAnchor="middle"
                    fontSize="8px"
                    fill="#000"
                  >
                    {districtName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
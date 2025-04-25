"use client";

import { useState } from "react";
import { PortugalMap } from "@/components/portugal-map";
import { MapYearSelector } from "@/components/map-year-selector";
import { DistrictNewsArticles } from "@/components/district-news-articles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MapContainer() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleDistrictClick = (district: string | null) => {
    setSelectedDistrict(district);
  };

  // Format district name for display
  const formatDistrictName = (name: string | null) => {
    if (!name) return "";
    if (name === "AÇORES") return "Açores";
    if (name === "MADEIRA") return "Madeira";
    return name;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Mapa de Distribuição Orçamental</CardTitle>
          <MapYearSelector selectedYear={selectedYear} onChange={handleYearChange} />
        </CardHeader>
        <CardContent>
          <PortugalMap 
            selectedYear={selectedYear} 
            onDistrictClick={handleDistrictClick} 
            externalSelectedDistrict={selectedDistrict} 
          />
        </CardContent>
      </Card>

      {selectedDistrict && (
        <Card>
          <CardHeader>
            <CardTitle>Notícias sobre {formatDistrictName(selectedDistrict)}</CardTitle>
            <CardDescription>
              Artigos de notícias relacionados com {formatDistrictName(selectedDistrict)} em {selectedYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DistrictNewsArticles year={selectedYear} district={selectedDistrict} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

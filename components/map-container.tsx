"use client";

import { useState, useEffect } from "react";
import { PortugalMap } from "@/components/portugal-map";
import { MapYearSelector } from "@/components/map-year-selector";
import { DistrictNewsArticles } from "@/components/district-news-articles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type TransferData = {
  Total: number;
  Districts: Array<{
    District: string;
    Total: number;
    NationalPercentage: string;
    Municipalities?: Record<string, number>;
  }>;
};

export function MapContainer() {
  const [selectedYear, setSelectedYear] = useState("2015");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

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

  // Format number as money in millions or billions
  const formatBudget = (amount: number) => {
    if (amount >= 1000) {
      return `€${(amount / 1000).toFixed(2)} B`;
    } else {
      return `€${amount.toFixed(2)} M`;
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch transfer data
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
  }, [selectedYear]);

  // Get district total budget
  const getDistrictTotal = () => {
    if (!transferData || !selectedDistrict) return null;
    
    const districtData = transferData.Districts.find(
      d => d.District.toUpperCase() === selectedDistrict.toUpperCase()
    );
    
    if (!districtData) return null;
    
    return {
      total: districtData.Total / 1000000, // Convert to millions
      percentage: Number(districtData.NationalPercentage)
    };
  };

  const districtBudget = getDistrictTotal();
  const nationalTotal = transferData ? transferData.Total / 1000000 : 0; // Convert to millions

  return (
    <div className={`space-y-6 ${selectedDistrict && !isMobile ? "lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0" : ""}`}>
      <Card className={selectedDistrict && !isMobile ? "lg:col-span-2" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-bold">Mapa de Distribuição Orçamental</CardTitle>
            {!loading && transferData && (
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Euro className="h-4 w-4" />
                {selectedDistrict ? (
                  <span>
                    Orçamento Total de {formatDistrictName(selectedDistrict)}: <strong>{formatBudget(districtBudget?.total || 0)}</strong> 
                    <span className="ml-2">({districtBudget?.percentage.toFixed(2)}% do orçamento nacional)</span>
                  </span>
                ) : (
                  <span>Orçamento Total Nacional: <strong>{formatBudget(nationalTotal)}</strong></span>
                )}
              </div>
            )}
          </div>
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
        <Card className={!isMobile ? "lg:col-span-1" : ""}>
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

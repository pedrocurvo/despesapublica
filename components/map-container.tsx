"use client";

import { useState } from "react";
import { PortugalMap } from "@/components/portugal-map";
import { MapYearSelector } from "@/components/map-year-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MapContainer() {
  const [selectedYear, setSelectedYear] = useState("2023");

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Budget Distribution Map</CardTitle>
        <MapYearSelector selectedYear={selectedYear} onChange={handleYearChange} />
      </CardHeader>
      <CardContent>
        <PortugalMap selectedYear={selectedYear} />
      </CardContent>
    </Card>
  );
}

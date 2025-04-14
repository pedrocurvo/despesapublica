"use client";

import { useState } from "react";
import { PortugalGeoMap } from "./portugal-geo-map";
import { MapYearSelector } from "./map-year-selector";

export function MapContainer() {
  const [selectedYear, setSelectedYear] = useState("2023");

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-4 flex justify-end">
        <MapYearSelector onYearChange={setSelectedYear} />
      </div>
      <PortugalGeoMap selectedYear={selectedYear} />
    </div>
  );
}

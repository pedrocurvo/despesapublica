"use client";

import { useState } from "react";
import { PortugalMap } from "./portugal-map";
import { MapYearSelector } from "./map-year-selector";

export function MapContainer() {
  const [selectedYear, setSelectedYear] = useState("2023");

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mb-4 flex justify-end">
        <MapYearSelector onYearChange={setSelectedYear} />
      </div>
      <PortugalMap />
    </div>
  );
}

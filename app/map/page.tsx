import type { Metadata } from "next"
import { PortugalMap } from "@/components/portugal-map"
import { MapYearSelector } from "@/components/map-year-selector"

export const metadata: Metadata = {
  title: "Budget Map | Portuguese Government Budget",
  description: "Regional budget distribution across Portuguese districts",
}

export default function MapPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Regional Budget Distribution</h1>
            <p className="text-muted-foreground">
              Hover over districts to see budget allocation, contribution, and expenditure
            </p>
          </div>
          <MapYearSelector />
        </div>
        <div className="mx-auto max-w-5xl">
          <PortugalMap />
        </div>
      </main>
    </div>
  )
}

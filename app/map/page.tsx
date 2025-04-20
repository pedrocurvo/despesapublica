import type { Metadata } from "next"
import { MapContainer } from "@/components/map-container"

export const metadata: Metadata = {
  title: "Budget Map | Portuguese Government Budget",
  description: "Regional budget distribution across Portuguese districts",
}

export default function MapPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4">
          <MapContainer />
        </div>
      </main>
    </div>
  )
}

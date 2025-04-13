import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Euro } from "lucide-react"

import { Button } from "@/components/ui/button"
import { PortugalMap } from "@/components/portugal-map"
import { MapYearSelector } from "@/components/map-year-selector"

export const metadata: Metadata = {
  title: "Budget Map | Portuguese Government Budget",
  description: "Regional budget distribution across Portuguese districts",
}

export default function MapPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Euro className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Portuguese Budget Portal</h1>
        </div>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/compare">Compare</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/map" className="font-medium">
              Map
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/news">News</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">About</Link>
          </Button>
        </nav>
      </header>
      <div className="flex items-center gap-2 border-b px-4 py-2 md:px-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
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

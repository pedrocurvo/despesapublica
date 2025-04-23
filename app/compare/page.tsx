import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { SectorComparison } from "@/components/sector-comparison"
import { YearlyComparison } from "@/components/yearly-comparison"
import { SectorSelector } from "@/components/sector-selector"
import { DistrictTrends } from "@/components/district-trends"
import { SectorTrends } from "@/components/sector-trends"
import { SectorsProvider } from "@/lib/sectors-context"
import { DateRangeProvider } from "@/lib/date-range-context"

export const metadata: Metadata = {
  title: "Compare Budget Data | Portuguese Government Budget",
  description: "Compare budget data across different years and sectors",
}

export default function ComparePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <DateRangeProvider>
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Budget Comparison</h1>
              <p className="text-muted-foreground">Compare budget data across different years and sectors</p>
            </div>
          </div>
          <SectorsProvider>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>District & Municipality Trends</CardTitle>
                    <CardDescription>Compare budget allocation trends across regions over time</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <DistrictTrends />
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sector & Subsector Trends</CardTitle>
                    <CardDescription>Compare budget allocation trends across sectors over time</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <SectorTrends />
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Yearly Budget Comparison</CardTitle>
                    <CardDescription>Compare total budget allocation and expenditure over time</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <YearlyComparison />
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Sector Comparison</CardTitle>
                    <CardDescription>Compare budget allocation by sector</CardDescription>
                  </div>
                  <SectorSelector />
                </CardHeader>
                <CardContent>
                  <SectorComparison />
                </CardContent>
              </Card>
            </div>
          </SectorsProvider>
        </DateRangeProvider>
      </main>
    </div>
  )
}

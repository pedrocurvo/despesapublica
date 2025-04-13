import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Euro } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { SectorComparison } from "@/components/sector-comparison"
import { YearlyComparison } from "@/components/yearly-comparison"
import { SectorSelector } from "@/components/sector-selector"

export const metadata: Metadata = {
  title: "Compare Budget Data | Portuguese Government Budget",
  description: "Compare budget data across different years and sectors",
}

export default function ComparePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
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
            <h1 className="text-2xl font-bold tracking-tight">Budget Comparison</h1>
            <p className="text-muted-foreground">Compare budget data across different years and sectors</p>
          </div>
          <DateRangePicker />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
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
      </main>
    </div>
  )
}

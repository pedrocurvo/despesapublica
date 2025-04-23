import type { Metadata } from "next"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DistrictTrends } from "@/components/district-trends"
import { SectorTrends } from "@/components/sector-trends"
import { SectorsProvider } from "@/lib/sectors-context"
import { DateRangeProvider } from "@/lib/date-range-context"
import { BudgetOverviewTrends } from "@/components/budget-overview-trends"
import { ExpenseOverviewTrends } from "@/components/expense-overview-trends"
import { Button } from "@/components/ui/button"

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
          
          {/* Navigation Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="#budget-overview">Budget Overview</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#expense-overview">Expense Overview</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#district-trends">District Trends</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#sector-trends">Sector Trends</a>
            </Button>
          </div>
          
          <SectorsProvider>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Card className="lg:col-span-3" id="budget-overview">
                <CardHeader>
                  <CardTitle>Budget Overview Trends</CardTitle>
                  <CardDescription>Compare revenue and expense trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetOverviewTrends />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3" id="expense-overview">
                <CardHeader>
                  <CardTitle>Expense Overview Trends</CardTitle>
                  <CardDescription>Compare budgeted vs executed expense trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseOverviewTrends />
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7" id="district-trends">
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
              <Card className="lg:col-span-7" id="sector-trends">
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
          </SectorsProvider>
        </DateRangeProvider>
      </main>
    </div>
  )
}

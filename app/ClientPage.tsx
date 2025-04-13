"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentNews } from "@/components/recent-news"
import { YearSelector } from "@/components/year-selector"
import { BudgetDistribution } from "@/components/budget-distribution"
import { DistributionYearSelector } from "@/components/distribution-year-selector"
import { YearComparisonChart } from "@/components/year-comparison-chart"

export default function ClientPage() {
  const [comparisonYears, setComparisonYears] = useState<string[]>(["2023", "2022"])
  const [distributionYear, setDistributionYear] = useState("2023")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Yearly budget allocation and expenditure (2018-2023)</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budget Distribution</CardTitle>
                <CardDescription>Breakdown by sector for {distributionYear}</CardDescription>
              </div>
              <DistributionYearSelector selectedYear={distributionYear} onYearChange={setDistributionYear} />
            </CardHeader>
            <CardContent>
              <BudgetDistribution year={distributionYear} />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Year Comparison</CardTitle>
                <CardDescription>Select years to compare budget allocations</CardDescription>
              </div>
              <YearSelector onYearsChange={setComparisonYears} />
            </CardHeader>
            <CardContent>
              <YearComparisonChart selectedYears={comparisonYears} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Budget News</CardTitle>
              <CardDescription>Latest news related to government budget</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentNews />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useState } from "react"
import { Euro } from "lucide-react"

import { Button } from "@/components/ui/button"
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
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Euro className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Despesa Publica</h1>
        </div>
        <nav className="ml-auto flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Dashboard</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/compare">Compare</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/map">Map</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/news">News</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">About</Link>
          </Button>
        </nav>
      </header>
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

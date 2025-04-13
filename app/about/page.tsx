import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Euro, FileText, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About | Portuguese Government Budget",
  description: "About the Portuguese Budget Portal and data sources",
}

export default function AboutPage() {
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
            <Link href="/map">Map</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/news">News</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/about" className="font-medium">
              About
            </Link>
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">About the Portal</h1>
          <p className="text-muted-foreground">Information about the Portuguese Budget Portal and data sources</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About the Project
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The Portuguese Budget Portal is a visualization tool designed to make government budget data more
                accessible and understandable to the public. Our goal is to promote transparency and accountability in
                public finances.
              </p>
              <p>
                This portal allows users to explore budget data across different years and sectors, compare allocations
                and expenditures, and stay informed about budget-related news and developments.
              </p>
              <p>
                The data presented in this portal includes both proposed and expended amounts for the overall budget and
                specific sectors such as education, healthcare, defense, and more.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The data presented in this portal is sourced from official government publications, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Annual Budget Reports from the Ministry of Finance</li>
                <li>Budget Execution Reports from the Portuguese Court of Auditors</li>
                <li>Sector-specific reports from relevant ministries</li>
                <li>Statistical data from the National Institute of Statistics (INE)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Note: The current version of the portal uses mock data for demonstration purposes. In a production
                environment, this would be replaced with actual budget data from official sources.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>How to Use the Portal</CardTitle>
              <CardDescription>A guide to navigating and using the Portuguese Budget Portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Dashboard</h3>
                <p>
                  The dashboard provides an overview of the budget data, including key metrics and visualizations. You
                  can see the total budget, major sector allocations, and trends over time.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Compare</h3>
                <p>
                  The compare page allows you to select specific years and sectors to compare budget allocations and
                  expenditures. Use the date range picker to specify a time period and the sector selector to choose
                  which sectors to compare.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">News</h3>
                <p>
                  The news page provides access to budget-related news articles organized by year. This helps you stay
                  informed about important developments and discussions related to the Portuguese government budget.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Data Interpretation</h3>
                <p>When interpreting the data, note that:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>All monetary values are shown in billions of euros (€B)</li>
                  <li>"Proposed" refers to the initially approved budget allocation</li>
                  <li>"Expended" refers to the actual amount spent during the fiscal year</li>
                  <li>Percentages may indicate year-over-year changes or proportion of the total budget</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

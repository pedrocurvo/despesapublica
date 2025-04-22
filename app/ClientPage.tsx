"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentNews } from "@/components/recent-news"
import { YearSelector } from "@/components/year-selector"
import { BudgetDistribution } from "@/components/budget-distribution"
import { DistributionYearSelector } from "@/components/distribution-year-selector"
import { ExpenseOverview } from "@/components/expense-overview"

// Type definitions for budget data
interface SectorBudget {
  proposed: number
  expended: number
}

interface YearBudgetData {
  total: SectorBudget
  sectors: {
    [key: string]: SectorBudget
  }
}

interface BudgetSectorData {
  name: string
  value: number
  color: string
}

// Color mapping for sectors
const sectorColors = {
  education: "#3b82f6",
  healthcare: "#ef4444",
  "social-security": "#f59e0b",
  infrastructure: "#10b981",
  defense: "#6366f1",
  justice: "#8b5cf6",
  environment: "#06b6d4",
  culture: "#ec4899",
  other: "#94a3b8",
}

export default function ClientPage() {
  const [comparisonYears, setComparisonYears] = useState<string[]>(["2023", "2022"])
  const [distributionYear, setDistributionYear] = useState("2023")
  const [budgetData, setBudgetData] = useState<BudgetSectorData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch budget data for the selected year
  useEffect(() => {
    const fetchBudgetData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/budget?year=${distributionYear}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch budget data for ${distributionYear}`)
        }
        
        const data: YearBudgetData = await response.json()
        
        // Transform data into a format suitable for the pie chart
        const chartData: BudgetSectorData[] = Object.entries(data.sectors).map(([sectorName, sectorData]) => ({
          name: sectorName.charAt(0).toUpperCase() + sectorName.slice(1).replace('-', ' '),
          value: sectorData.expended,
          color: sectorColors[sectorName] || "#94a3b8"
        }))
        
        setBudgetData(chartData)
      } catch (err) {
        console.error("Error fetching budget data:", err)
        setError("Failed to load budget data")
        setBudgetData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBudgetData()
  }, [distributionYear])

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
              <Overview startYear={2021} endYear={2023} />
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
              <BudgetDistribution 
                year={distributionYear} 
                data={budgetData} 
                isLoading={isLoading} 
              />
              {error && (
                <div className="mt-2 text-center text-sm text-red-500">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Expense Overview</CardTitle>
              <CardDescription>Detailed analysis of government expenses (2021-2023)</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseOverview startYear={2021} endYear={2023} />
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

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentNews } from "@/components/recent-news"
import { DistributionYearSelector } from "@/components/distribution-year-selector"
import { ExpenseOverview } from "@/components/expense-overview"
import { Button } from "@/components/ui/button"
import HomeBudgetPieChart from "@/components/home-budget-pie-chart"

export default function ClientPage() {
  const [distributionYear, setDistributionYear] = useState("2023")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
const router = useRouter()

  const handleYearClick = (year: string) => {
    setDistributionYear(year);
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Balanço Orçamental</CardTitle>
              <CardDescription>Receita e despesa anual (2013-2023)</CardDescription>
            </CardHeader>
            <CardContent>
              <Overview startYear={2013} endYear={2023} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Notícias Recentes do Orçamento</CardTitle>
              <CardDescription>Últimas notícias relacionadas com o orçamento do governo</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentNews />
            </CardContent>
          </Card>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Panorama de Despesas</CardTitle>
              <CardDescription>Despesa orçamentada e real (2015-2023)</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseOverview 
                startYear={2015} 
                endYear={2023}
                onYearClick={handleYearClick}
              />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Distribuição do Orçamento</CardTitle>
                <CardDescription>Divisão por setor para {distributionYear}</CardDescription>
              </div>
              <DistributionYearSelector selectedYear={distributionYear} onYearChange={setDistributionYear} />
            </CardHeader>
            <CardContent className="p-2 sm:p-4 md:p-6 pb-0">
              <div className="h-[350px]">
                <HomeBudgetPieChart 
                  year={distributionYear}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => router.push('/despesa')}
                >
                  Ver por setor
                </Button>
              </div>
              {error && (
                <div className="mt-2 text-center text-sm text-red-500">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

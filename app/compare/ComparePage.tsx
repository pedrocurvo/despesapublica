"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DistrictTrends } from "@/components/district-trends"
import { SectorTrends } from "@/components/sector-trends"
import { SectorsProvider } from "@/lib/sectors-context"
import { DateRangeProvider } from "@/lib/date-range-context"
import { BudgetOverviewTrends } from "@/components/budget-overview-trends"
import { ExpenseOverviewTrends } from "@/components/expense-overview-trends"
import { Button } from "@/components/ui/button"

export default function MainComparePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <DateRangeProvider>
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Comparação Orçamental</h1>
              <p className="text-muted-foreground">Compara dados orçamentais entre diferentes anos, setores, distritos e municípios</p>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="#budget-overview">Visão Geral do Orçamento</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#expense-overview">Visão Geral das Despesas</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#sector-trends">Tendências por Setor</a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="#district-trends">Tendências por Distrito</a>
            </Button>
          </div>
          
          <SectorsProvider>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <Card className="lg:col-span-3" id="budget-overview">
                <CardHeader>
                  <CardTitle>Tendências Gerais do Orçamento</CardTitle>
                  <CardDescription>Compara tendências de receitas e despesas ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <BudgetOverviewTrends />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3" id="expense-overview">
                <CardHeader>
                  <CardTitle>Tendências Gerais das Despesas</CardTitle>
                  <CardDescription>Compara tendências de despesas orçamentadas vs executadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ExpenseOverviewTrends />
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7" id="sector-trends">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tendências por Setor e Respetivas Medidas</CardTitle>
                    <CardDescription>Compara tendências de alocação orçamental entre setores e respetivas medidas do programa ao longo do tempo</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <SectorTrends />
                </CardContent>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-7" id="district-trends">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Tendências por Distrito e Município</CardTitle>
                    <CardDescription>Compara tendências de alocação orçamental entre regiões ao longo do tempo</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <DistrictTrends />
                </CardContent>
              </Card>
            </div>
          </SectorsProvider>
        </DateRangeProvider>
      </main>
    </div>
  )
}

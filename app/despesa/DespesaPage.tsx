"use client";

import { useState } from "react";
import BudgetPieChart from "@/components/budget-pie-chart";
import BudgetYearSelector from "@/components/budget-year-selector";
import { SectorNewsArticles } from "@/components/sector-news-articles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MainDespesaPage() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const availableYears = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Despesa</h1>
          <p className="text-muted-foreground">
          Visualização da despesa pública por setor e respetivas medidas do programa orçamental
          </p>
        </div>
        
        <div className="flex justify-end mb-4">
          <BudgetYearSelector 
            currentYear={selectedYear} 
            onYearChange={setSelectedYear} 
            availableYears={availableYears}
          />
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <BudgetPieChart 
            year={selectedYear} 
            onSectorClick={setSelectedSector}
            showTooltip={false}
          />
        </div>

        {selectedSector && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Notícias sobre {selectedSector}</CardTitle>
                <CardDescription>
                  Artigos de notícias relacionados com {selectedSector} em {selectedYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SectorNewsArticles year={selectedYear} sector={selectedSector} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
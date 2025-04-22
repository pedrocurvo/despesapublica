"use client";

import { useState } from "react";
import BudgetPieChart from "@/components/budget-pie-chart";
import BudgetYearSelector from "@/components/budget-year-selector";

export default function DespesaPage() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const availableYears = ["2022", "2023"]; // You can expand this list as more data becomes available

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Despesa Pública</h1>
          <p className="text-muted-foreground">
            Visualização da despesa pública por sector e subsector
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
          <BudgetPieChart year={selectedYear} />
        </div>
      </div>
    </div>
  );
}
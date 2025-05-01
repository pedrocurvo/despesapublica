"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsArticles } from "@/components/news-articles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

export default function NewsPage() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null)

  // Complete list of sectors based on Portuguese government budget structure
  const sectors = [
    { value: "governance", label: "Governação" },
    { value: "external", label: "Representação Externa" },
    { value: "defense", label: "Defesa" },
    { value: "security", label: "Segurança Interna" },
    { value: "justice", label: "Justiça" },
    { value: "finance", label: "Finanças" },
    { value: "public_debt", label: "Gestão da Dívida Pública" },
    { value: "economy", label: "Economia" },
    { value: "sea", label: "Mar" },
    { value: "culture", label: "Cultura" },
    { value: "science", label: "Ciência, Tecnologia e Ensino Superior" },
    { value: "education", label: "Ensino Básico e Secundário" },
    { value: "social-security", label: "Trabalho, Solidariedade e Segurança Social" },
    { value: "healthcare", label: "Saúde" },
    { value: "environment", label: "Ambiente e Ação Climática" },
    { value: "infrastructure", label: "Infraestruturas e Habitação" },
    { value: "housing", label: "Habitação" },
    { value: "agriculture", label: "Agricultura e Alimentação" },
    { value: "tourism", label: "Turismo" }
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Notícias do Orçamento</h1>
          <p className="text-muted-foreground">
            Notícias e atualizações relacionadas com o orçamento do governo português preservadas no{" "}
            <a
              href="https://arquivo.pt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Arquivo.pt
            </a>
            .
          </p>
        </div>

        <Tabs defaultValue={String(years[0])}>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mb-4">
            <TabsList className="w-full md:w-auto h-auto flex-wrap">
              {years.map((year) => (
                <TabsTrigger key={year} value={String(year)}>
                  {year}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {/* Sector filter dropdown */}
            <Select 
              value={selectedSector || "all"} 
              onValueChange={(value) => setSelectedSector(value === "all" ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filtrar por setor" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">Todos os setores</SelectItem>
                  <SelectLabel>Setores</SelectLabel>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {years.map((year) => (
            <TabsContent key={year} value={String(year)}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Notícias do Orçamento de {year}
                    {selectedSector && ` - ${sectors.find(s => s.value === selectedSector)?.label}`}
                  </CardTitle>
                  <CardDescription>
                    Artigos de notícias relacionados com o orçamento do governo português de {year}
                    {selectedSector && ` para o setor ${sectors.find(s => s.value === selectedSector)?.label}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsArticles year={year} sector={selectedSector} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
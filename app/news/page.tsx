import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsArticles } from "@/components/news-articles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Notícias do Orçamento | Orçamento do Governo Português",
  description: "Últimas notícias relacionadas com o orçamento do governo português",
}

const years = [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

export default function NewsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Notícias do Orçamento</h1>
          <p className="text-muted-foreground">
            Últimas notícias e atualizações relacionadas com o orçamento do governo português
          </p>
        </div>

        <Tabs defaultValue={String(years[0])}>
          <TabsList className="mb-4">
            {years.map((year) => (
              <TabsTrigger key={year} value={String(year)}>
                {year}
              </TabsTrigger>
            ))}
          </TabsList>

          {years.map((year) => (
            <TabsContent key={year} value={String(year)}>
              <Card>
                <CardHeader>
                  <CardTitle>Notícias do Orçamento de {year}</CardTitle>
                  <CardDescription>
                    Artigos de notícias relacionados com o orçamento do governo português de {year}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NewsArticles year={year} />
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
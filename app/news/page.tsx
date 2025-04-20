import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsArticles } from "@/components/news-articles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Budget News | Portuguese Government Budget",
  description: "Latest news related to the Portuguese government budget",
}

const years = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

export default function NewsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Budget News</h1>
          <p className="text-muted-foreground">
            Latest news and updates related to the Portuguese government budget
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
                  <CardTitle>{year} Budget News</CardTitle>
                  <CardDescription>
                    News articles related to the {year} Portuguese government budget
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
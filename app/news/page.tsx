import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Euro } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewsArticles } from "@/components/news-articles"

export const metadata: Metadata = {
  title: "Budget News | Portuguese Government Budget",
  description: "Latest news related to the Portuguese government budget",
}

export default function NewsPage() {
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
            <Link href="/news" className="font-medium">
              News
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/about">About</Link>
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
          <h1 className="text-2xl font-bold tracking-tight">Budget News</h1>
          <p className="text-muted-foreground">Latest news and updates related to the Portuguese government budget</p>
        </div>
        <Tabs defaultValue="2023">
          <TabsList className="mb-4">
            <TabsTrigger value="2023">2023</TabsTrigger>
            <TabsTrigger value="2022">2022</TabsTrigger>
            <TabsTrigger value="2021">2021</TabsTrigger>
            <TabsTrigger value="2020">2020</TabsTrigger>
            <TabsTrigger value="2019">2019</TabsTrigger>
          </TabsList>
          <TabsContent value="2023">
            <Card>
              <CardHeader>
                <CardTitle>2023 Budget News</CardTitle>
                <CardDescription>News articles related to the 2023 Portuguese government budget</CardDescription>
              </CardHeader>
              <CardContent>
                <NewsArticles year={2023} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2022">
            <Card>
              <CardHeader>
                <CardTitle>2022 Budget News</CardTitle>
                <CardDescription>News articles related to the 2022 Portuguese government budget</CardDescription>
              </CardHeader>
              <CardContent>
                <NewsArticles year={2022} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2021">
            <Card>
              <CardHeader>
                <CardTitle>2021 Budget News</CardTitle>
                <CardDescription>News articles related to the 2021 Portuguese government budget</CardDescription>
              </CardHeader>
              <CardContent>
                <NewsArticles year={2021} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2020">
            <Card>
              <CardHeader>
                <CardTitle>2020 Budget News</CardTitle>
                <CardDescription>News articles related to the 2020 Portuguese government budget</CardDescription>
              </CardHeader>
              <CardContent>
                <NewsArticles year={2020} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="2019">
            <Card>
              <CardHeader>
                <CardTitle>2019 Budget News</CardTitle>
                <CardDescription>News articles related to the 2019 Portuguese government budget</CardDescription>
              </CardHeader>
              <CardContent>
                <NewsArticles year={2019} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

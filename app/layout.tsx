import type { Metadata } from 'next'
import './globals.css'
import Link from "next/link"
import { Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <Euro className="h-6 w-6" />
              <h1 className="text-lg font-semibold">Despesa Publica</h1>
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
                <Link href="/about">About</Link>
              </Button>
            </nav>
          </header>
          {children}
          <footer className="border-t py-4 px-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">© 2023 Portuguese Budget Portal. All rights reserved.</p>
              <nav className="flex gap-4 text-sm text-muted-foreground">
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:underline">
                  Privacy
                </Link>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
              </nav>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

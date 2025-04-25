import type { Metadata } from 'next'
import './globals.css'
import Link from "next/link"
import { Euro } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: 'Despesa Pública | Orçamento do Governo Português',
  description: 'Visualização da despesa pública por sector e subsector do orçamento governamental Português',
  generator: 'Next.js',
  applicationName: 'Despesa Pública',
  keywords: "despesa pública, orçamento, portugal, setores, subsectores, finanças públicas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2">
              <Euro className="h-6 w-6" />
              <h1 className="text-lg font-semibold">Despesa Publica</h1>
            </div>
            <nav className="ml-auto flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">Painel</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/despesa">Despesa</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/compare">Comparar</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/map">Mapa</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/news">Notícias</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/about">Sobre</Link>
              </Button>
              <div className="flex items-center ml-2">
                <ThemeToggle />
              </div>
            </nav>
          </header>
          {children}
          <footer className="border-t py-4 px-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">© 2023 Portal do Orçamento Português. Todos os direitos reservados.</p>
              <nav className="flex gap-4 text-sm text-muted-foreground">
                <Link href="/terms" className="hover:underline">
                  Termos
                </Link>
                <Link href="/privacy" className="hover:underline">
                  Privacidade
                </Link>
                <Link href="/team" className="hover:underline">
                  Contacto
                </Link>
              </nav>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

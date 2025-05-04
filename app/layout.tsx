import type { Metadata } from 'next'
import './globals.css'
import Link from "next/link"
import { Euro } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { NavMenu, NavItem } from "@/components/nav-menu"

export const metadata: Metadata = {
  title: "Despesa Pública - Como São Usados Os Nossos Impostos?",
  description: "Explore facilmente como o dinheiro público é gasto em Portugal — por setor, medidas do programa e região. Acompanhe as decisões do governo com clareza e transparência.",
  generator: 'Next.js',
  applicationName: 'Despesa Pública',
  keywords: "despesa pública, orçamento, portugal, setores, subsetores, finanças públicas",
  openGraph: {
    title: "Despesa Pública - Como São Usados Os Nossos Impostos?",
    description: "Explore facilmente como o dinheiro público é gasto em Portugal — por setor, medidas do programa e região. Acompanhe as decisões do governo com clareza e transparência.",
    siteName: "Despesa Pública",
  },
  twitter: {
    card: "summary_large_image",
    title: "Despesa Pública - Como São Usados Os Nossos Impostos?",
    description: "Explore facilmente como o dinheiro público é gasto em Portugal — por setor, medidas do programa e região. Acompanhe as decisões do governo com clareza e transparência.",
    creator: "@pedrocurvo",
  },
}

// Navigation links array that can be easily modified
const navLinks: NavItem[] = [
  { name: "Painel", href: "/" },
  { name: "Despesa", href: "/despesa" },
  { name: "Mapa", href: "/map" },
  { name: "Comparar", href: "/compare" },
  { name: "Notícias", href: "/news" },
  { name: "Sobre", href: "/about" },
]

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
              <h1 className="text-lg font-semibold">Despesa Pública</h1>
            </div>
            <NavMenu links={navLinks} />
          </header>
          {children}
          <footer className="border-t py-4 px-6">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DespesaPública.net. Todos os direitos reservados.</p>
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

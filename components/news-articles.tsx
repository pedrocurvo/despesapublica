"use client"

import { CalendarIcon, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { NewsArticle, fetchNewsArticles, newsDomains, processNewsArticles } from "@/lib/news-utils"

interface NewsArticlesProps {
  year: number
  sector?: string | null
}

// Object mapping sectors to related keywords for more targeted searches
const sectorKeywords = {
  education: ["educação", "ensino", "escola", "universidade", "estudantes"],
  healthcare: ["saúde", "hospitais", "médicos", "enfermeiros", "sns"],
  "social-security": ["segurança social", "pensões", "reformas", "apoios sociais"],
  infrastructure: ["infraestrutura", "transportes", "estradas", "ferrovia", "obras públicas"],
  defense: ["defesa", "forças armadas", "militares", "exército", "marinha"],
  justice: ["justiça", "tribunais", "magistrados", "sistema judicial"],
  environment: ["ambiente", "clima", "sustentabilidade", "poluição", "energias renováveis"],
  culture: ["cultura", "artes", "património", "museus", "espetáculos"],
  finance: ["finanças", "impostos", "receitas", "despesas", "orçamento"],
  economy: ["economia", "empresas", "indústria", "turismo", "competitividade"],
  agriculture: ["agricultura", "desenvolvimento rural", "pescas", "produção agrícola"],
  science: ["ciência", "tecnologia", "investigação", "inovação", "ensino superior"],
  external: ["negócios estrangeiros", "diplomacia", "embaixadas", "cooperação externa"],
  governance: ["governação", "administração pública", "modernização", "simplificação"],
  housing: ["habitação", "arrendamento", "construção", "reabilitação urbana"],
  sea: ["mar", "recursos marítimos", "portos", "pesca", "economia do mar"],
  tourism: ["turismo", "hotelaria", "restauração", "património", "promoção turística"],
  public_debt: ["dívida pública", "juros", "amortização", "gestão da dívida"],
  security: ["segurança interna", "polícia", "proteção civil", "bombeiros"]
}

export function NewsArticles({ year, sector }: NewsArticlesProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Calculate date range (September of previous year to August of current year)
        const fromDate = `${year - 1}-09-01`
        const toDate = `${year}-08-31`
        
        // Determine queries based on whether a sector is selected
        let queries: string[] = []
        let keywords: string[] = []
        
        if (sector) {
          // Get proper sector name in Portuguese
          const sectorNameMap = {
            "education": "Educação",
            "healthcare": "Saúde",
            "social-security": "Segurança Social",
            "infrastructure": "Infraestruturas",
            "defense": "Defesa",
            "justice": "Justiça",
            "environment": "Ambiente",
            "culture": "Cultura",
            "finance": "Finanças",
            "economy": "Economia",
            "agriculture": "Agricultura",
            "science": "Ciência e Tecnologia",
            "external": "Representação Externa",
            "governance": "Governação",
            "housing": "Habitação",
            "sea": "Mar",
            "tourism": "Turismo",
            "public_debt": "Gestão da Dívida Pública",
            "security": "Segurança Interna"
          }
          
          const sectorName = sectorNameMap[sector as keyof typeof sectorNameMap] || sector
          
          // Add sector-specific queries
          queries = [
            `orçamento ${sectorName} ${year}`,
            `despesa ${sectorName} ${year}`,
            `${sectorName} orçamento estado ${year}`
          ]
          
          // Add sector-specific keywords for article relevance sorting
          keywords = [sectorName, "orçamento", "despesa"]
          
          // Add keywords related to the sector to enrich the queries
          const sectorSpecificKeywords = sectorKeywords[sector as keyof typeof sectorKeywords] || []
          if (sectorSpecificKeywords.length > 0) {
            // Add more specific queries with keywords
            sectorSpecificKeywords.forEach(keyword => {
              queries.push(`orçamento ${keyword} ${year}`)
              queries.push(`despesa ${keyword} ${year}`)
            })
            
            // Add to keywords for article relevance sorting
            keywords = [...keywords, ...sectorSpecificKeywords]
          }
        } else {
          // Base search queries for general budget news
          queries = [
            `orçamento estado ${year}`,
            `execução orçamental ${year}`,
            `despesa pública ${year}`,
            `orçamento geral ${year}`,
            `OE ${year}`,
            `lei orçamento ${year}`,
            `relatório orçamento ${year}`,
            `debate orçamento ${year}`,
            `aprovação orçamento ${year}`,
            `ministro finanças orçamento ${year}`,
            `programa orçamental ${year}`,
            `medidas orçamentais ${year}`,
            `receitas estado ${year}`,
            `défice orçamental ${year}`,
            `discussão orçamento ${year}`
          ]
          
          // Add general keywords for article relevance sorting
          keywords = ["orçamento", "despesa", "OE", "estado", "finanças", "défice"]
        }
        
        // Fetch all articles using the utility function
        const rawArticles = await fetchNewsArticles(
          queries, 
          fromDate, 
          toDate, 
          newsDomains,
          true // silent mode
        )
        
        // Process and format articles
        const processedArticles = processNewsArticles(rawArticles, {
          keywords: keywords,
          idPrefix: `${year}-${sector || "general"}`,
          limit: 15,
          specialWord: sector || "orçamento",
          fromDate: `${year}`,
        })
        
        setArticles(processedArticles)
      } catch (err) {
        console.error("Error fetching news articles:", err)
        setError("Failed to load news articles. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchNews()
  }, [year, sector])
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="py-6 text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <div key={article.id} className="border-b pb-5 last:border-0">
          <h3 className="text-lg font-medium">{article.title}</h3>
          <div className="mt-1 flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{article.date}</span>
            <span className="mx-2">•</span>
            <span>{article.source}</span>
          </div>
          {article.summary && (
            <p className="mt-3 text-muted-foreground">{article.summary}</p>
          )}
          <div className="mt-3">
            <Link href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:underline">
              Ler artigo completo
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      ))}
      {articles.length === 0 && !loading && (
        <div className="py-10 text-center text-muted-foreground">
          {sector 
            ? `Não há artigos de notícias disponíveis para o setor ${sector} em ${year}` 
            : `Não há artigos de notícias disponíveis para ${year}`}
        </div>
      )}
    </div>
  )
}

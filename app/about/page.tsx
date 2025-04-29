import type { Metadata } from "next"
import { FileText, Info } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sobre | DespesaPública.pt",
  description: "Sobre a DespesaPública.pt e fontes de dados",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Sobre a DespesaPública.pt</h1>
          <p className="text-muted-foreground">Informações sobre a DespesaPública.pt e fontes de dados</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Sobre o Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
              A DespesaPublica.pt é uma plataforma que recorre à Direção-Geral do Orçamento e ao Arquivo.pt para 
              tornar a informação sobre os orçamentos do Estado mais acessível e transparente.
              </p>
              <p>
              Através deste site, é possível explorar dados sobre a despesa e a receita pública, 
              consultar os valores orçamentados e executados e analisar a aplicação dos recursos por distrito, 
              município, setor e respetivas medidas de programa.
              </p>
              <p>
              O nosso objetivo é facilitar o acesso a esta informação de forma clara e intuitiva, promovendo a transparência nas finanças públicas. 
              Acreditamos que uma população informada, que conhece a forma como os seus impostos são aplicados, têm mais capacidade para exigir melhores 
              decisões e maior responsabilidade na gestão dos recursos públicos.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Fontes de Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>As notícias apresentadas são obtidas através do Arquivo.pt e os dados de publicações oficiais do governo publicados online na Direção-Geral do Orçamento (DGO).</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Como Utilizar a DespesaPública.pt</CardTitle>
              <CardDescription>Um guia para navegar e utilizar a DespesaPública.pt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Painel</h3>
                <p>
                O Painel oferece uma visão geral dos dados orçamentais, incluindo informações anuais 
                sobre o balanço orçamental, a despesa real e executada, a distribuição do orçamneto por setor, 
                além de notícias relevantes relacionadas a estes temas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Despesa</h3>
                <p>
                Na página de Despesa, pode visualizar a alocação orçamental por setor e, 
                dentro de cada setor, por medidas do programa orçamental. Esta página também 
                disponibiliza notícias associadas ao setor selecionado.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Mapa</h3>
                <p>
                A página Mapa apresenta a distribuição do orçamento por distrito e município, 
                permitindo uma visão territorial das despesas públicas.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Comparar</h3>
                <p>
                A página de Comparação permite selecionar diferentes anos e setores para analisar 
                a evolução das despesas orçamentais. Também é possível comparar despesas por distrito e município.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Notícias</h3>
                <p>
                  A página de Notícias proporciona acesso a artigos relacionados com o orçamento, organizados por ano e setor, 
                  provenientes do Arquivo.pt. Esta funcionalidade possibilita o acompanhamento dos principais projetos e iniciativas, 
                  ao longo dos anos, relacionados com a aplicação dos recursos públicos em Portugal.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

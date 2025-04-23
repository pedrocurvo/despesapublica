import type { Metadata } from "next"
import { FileText, Info } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sobre | Orçamento do Governo Português",
  description: "Sobre o Portal do Orçamento Português e fontes de dados",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Sobre o Portal</h1>
          <p className="text-muted-foreground">Informações sobre o Portal do Orçamento Português e fontes de dados</p>
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
                O Portal do Orçamento Português é uma ferramenta de visualização concebida para tornar os dados do orçamento
                governamental mais acessíveis e compreensíveis para o público. O nosso objetivo é promover a transparência
                e responsabilização nas finanças públicas.
              </p>
              <p>
                Este portal permite aos utilizadores explorar dados orçamentais ao longo de diferentes anos e setores,
                comparar dotações e despesas, e manter-se informados sobre notícias e desenvolvimentos relacionados com o orçamento.
              </p>
              <p>
                Os dados apresentados neste portal incluem tanto os valores propostos como os valores despendidos para o orçamento
                global e setores específicos como educação, saúde, defesa, entre outros.
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
              <p>Os dados apresentados neste portal são obtidos de publicações oficiais do governo, incluindo:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Relatórios Anuais do Orçamento do Ministério das Finanças</li>
                <li>Relatórios de Execução Orçamental do Tribunal de Contas Português</li>
                <li>Relatórios específicos de setores dos ministérios relevantes</li>
                <li>Dados estatísticos do Instituto Nacional de Estatística (INE)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Nota: A versão atual do portal utiliza dados simulados para fins de demonstração. Num ambiente de
                produção, estes seriam substituídos por dados orçamentais reais de fontes oficiais.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Como Utilizar o Portal</CardTitle>
              <CardDescription>Um guia para navegar e utilizar o Portal do Orçamento Português</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Painel</h3>
                <p>
                  O painel fornece uma visão geral dos dados orçamentais, incluindo métricas-chave e visualizações. Pode
                  ver o orçamento total, as principais alocações por setor e tendências ao longo do tempo.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Comparar</h3>
                <p>
                  A página de comparação permite-lhe selecionar anos e setores específicos para comparar alocações
                  e despesas orçamentais. Utilize o seletor de intervalo de datas para especificar um período de tempo
                  e o seletor de setor para escolher quais os setores a comparar.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Notícias</h3>
                <p>
                  A página de notícias proporciona acesso a artigos relacionados com o orçamento organizados por ano.
                  Isto ajuda-o a manter-se informado sobre desenvolvimentos e discussões importantes relacionadas com
                  o orçamento do governo português.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Interpretação de Dados</h3>
                <p>Ao interpretar os dados, note que:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Todos os valores monetários são apresentados em mil milhões de euros (€MM)</li>
                  <li>"Proposto" refere-se à dotação orçamental inicialmente aprovada</li>
                  <li>"Executado" refere-se ao montante efetivamente gasto durante o ano fiscal</li>
                  <li>As percentagens podem indicar alterações de ano para ano ou proporção do orçamento total</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

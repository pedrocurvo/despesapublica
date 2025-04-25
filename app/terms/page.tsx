import type { Metadata } from "next"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Termos de Utilização | Orçamento do Governo Português",
  description: "Termos de utilização e condições do Portal do Orçamento Português",
}

export default function TermsPage() {
  // Current year for the copyright notice
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Termos de Utilização
            </CardTitle>
            <CardDescription>
              Última atualização: 25 de Abril de 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">1. Aceitação dos Termos</h2>
                  <p className="mt-2 text-muted-foreground">
                    Ao aceder e utilizar o Portal do Orçamento Português ("Portal"), o utilizador concorda em cumprir estes Termos de Serviço. Se não concordar com algum dos termos, solicitamos que não utilize o Portal.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">2. Descrição do Serviço</h2>
                  <p className="mt-2 text-muted-foreground">
                    O Portal do Orçamento Português é uma ferramenta de visualização de dados destinada a tornar a informação do orçamento do governo português mais acessível e compreensível para o público geral.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    O Portal disponibiliza dados sobre o orçamento do Estado português, incluindo receitas, despesas e alocações por setores e regiões, através de visualizações interativas e análises comparativas.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">3. Utilização do Portal</h2>
                  <p className="mt-2 text-muted-foreground">
                    O Portal é fornecido para fins informativos e educativos. O utilizador concorda em utilizar o Portal apenas para fins legais e de acordo com estes termos.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    É proibido:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Utilizar o Portal de qualquer forma que possa danificar, desativar ou sobrecarregar a plataforma</li>
                    <li>Tentar obter acesso não autorizado a sistemas ou redes conectadas ao Portal</li>
                    <li>Recolher dados dos utilizadores do Portal sem consentimento explícito</li>
                    <li>Utilizar o Portal para qualquer finalidade fraudulenta ou ilegal</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">4. Precisão dos Dados</h2>
                  <p className="mt-2 text-muted-foreground">
                    Embora nos esforcemos para garantir a precisão dos dados apresentados, não podemos garantir que o Portal esteja livre de erros ou imprecisões. Os dados são disponibilizados "tal como estão", sem garantias de qualquer tipo.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Os utilizadores são aconselhados a verificar as informações com as fontes oficiais para decisões importantes que se baseiem nesses dados.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">5. Propriedade Intelectual</h2>
                  <p className="mt-2 text-muted-foreground">
                    O conteúdo do Portal, incluindo, mas não se limitando a, textos, gráficos, logotipos, ícones, imagens e software, é propriedade do Portal do Orçamento Português ou dos seus fornecedores de conteúdo e está protegido por leis de direitos de autor portuguesas e internacionais.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    É permitido utilizar o conteúdo para fins não comerciais, desde que seja devidamente atribuída a fonte (Portal do Orçamento Português) e que não sejam feitas modificações ao conteúdo.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">6. Ligações a Terceiros</h2>
                  <p className="mt-2 text-muted-foreground">
                    O Portal pode conter ligações para websites de terceiros. Estas ligações são fornecidas apenas para conveniência e informação do utilizador. O Portal do Orçamento Português não tem controlo sobre o conteúdo desses websites e não assume qualquer responsabilidade pelo conteúdo, políticas de privacidade ou práticas de websites de terceiros.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">7. Limitação de Responsabilidade</h2>
                  <p className="mt-2 text-muted-foreground">
                    Em nenhuma circunstância o Portal do Orçamento Português, seus diretores, funcionários, parceiros ou agentes serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, punitivos ou consequentes decorrentes da utilização ou incapacidade de utilizar o Portal.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">8. Alterações aos Termos</h2>
                  <p className="mt-2 text-muted-foreground">
                    Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados no Portal. O uso contínuo do Portal após tais alterações constitui concordância com os novos termos.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">9. Lei Aplicável</h2>
                  <p className="mt-2 text-muted-foreground">
                    Estes Termos de Serviço são regidos e interpretados de acordo com as leis da República Portuguesa. Qualquer disputa decorrente destes termos será submetida à jurisdição exclusiva dos tribunais portugueses.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">10. Contato</h2>
                  <p className="mt-2 text-muted-foreground">
                    Para questões relacionadas com estes Termos de Serviço, por favor contacte-nos através do email: <a href="mailto:contact@portaldoorcamento.pt" className="text-blue-500 hover:underline">contact@portaldoorcamento.pt</a>
                  </p>
                </div>

                <div className="pt-4 text-center text-sm text-muted-foreground">
                  © {currentYear} Portal do Orçamento Português. Todos os direitos reservados.
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
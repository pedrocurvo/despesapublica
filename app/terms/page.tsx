import type { Metadata } from "next"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Termos de Utilização | DespesaPública.net ",
  description: "Termos de utilização e condições da DespesaPública.net",
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
                    Ao aceder e utilizar a DespesaPública.net - Como São Usados Os Nossos Impostos? ("DespesaPública.net" ou "Plataforma"), o utilizador concorda em cumprir estes Termos de Serviço. Se não concordar com algum dos termos, solicitamos que não utilize esta plataforma.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">2. Descrição do Serviço</h2>
                  <p className="mt-2 text-muted-foreground">
                    A DespesaPública.net é uma ferramenta de visualização de dados destinada a tornar a informação do orçamento do governo português mais acessível e compreensível para o público geral.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    A DespesaPública.net disponibiliza dados sobre o orçamento do Estado português, incluindo receitas, despesas e alocações por setores e regiões, através de visualizações interativas e análises comparativas.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">3. Utilização da DespesaPública.net</h2>
                  <p className="mt-2 text-muted-foreground">
                    A DespesaPública.net é fornecida para fins informativos e educativos. O utilizador concorda em utilizar a Plataforma apenas para fins legais e de acordo com estes termos.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    É proibido:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Utilizar a DespesaPública.net de qualquer forma que possa danificar, desativar ou sobrecarregar a Plataforma</li>
                    <li>Tentar obter acesso não autorizado a sistemas ou redes conectadas à Plataforma</li>
                    <li>Recolher dados dos utilizadores da DespesaPública.net sem consentimento explícito</li>
                    <li>Utilizar a DespesaPública.net para qualquer finalidade fraudulenta ou ilegal</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">4. Precisão dos Dados</h2>
                  <p className="mt-2 text-muted-foreground">
                    Embora nos esforcemos para garantir a precisão dos dados apresentados, não podemos garantir que a DespesaPública.net esteja livre de erros ou imprecisões. Os dados são disponibilizados "tal como estão", sem garantias de qualquer tipo.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Os utilizadores são aconselhados a verificar as informações com as fontes oficiais para decisões importantes que se baseiem nesses dados.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">5. Propriedade Intelectual</h2>
                  <p className="mt-2 text-muted-foreground">
                    O conteúdo da Plataforma, incluindo, mas não se limitando a, textos, gráficos, logotipos, ícones, imagens e software, é propriedade da DespesaPública.net ou dos seus fornecedores de conteúdo e está protegido por leis de direitos de autor portuguesas e internacionais.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    É permitido utilizar o conteúdo para fins não comerciais, desde que seja devidamente atribuída a fonte (DespesaPública.net) e que não sejam feitas modificações ao conteúdo.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">6. Ligações a Terceiros</h2>
                  <p className="mt-2 text-muted-foreground">
                    A DespesaPública.net pode conter ligações para websites de terceiros. Estas ligações são fornecidas apenas para conveniência e informação do utilizador. A DespesaPública.net não tem controlo sobre o conteúdo desses websites e não assume qualquer responsabilidade pelo conteúdo, políticas de privacidade ou práticas de websites de terceiros.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">7. Limitação de Responsabilidade</h2>
                  <p className="mt-2 text-muted-foreground">
                    Em nenhuma circunstância a DespesaPública.net, seus diretores, funcionários, parceiros ou agentes serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, punitivos ou consequentes decorrentes da utilização ou incapacidade de utilizar a Plataforma.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">8. Alterações aos Termos</h2>
                  <p className="mt-2 text-muted-foreground">
                    Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados na DespesaPública.net. O uso contínuo do Plataforma após tais alterações constitui concordância com os novos termos.
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
                  <h2 className="text-xl font-semibold">10. Contacto</h2>
                  <p className="mt-2 text-muted-foreground">
                    Para questões relacionadas com estes Termos de Serviço, por favor contacte-nos através do email: <a href="mailto:contacto@despesapublica.net" className="text-blue-500 hover:underline">contacto@despesapublica.net</a>
                  </p>
                </div>

                <div className="pt-4 text-center text-sm text-muted-foreground">
                  © {currentYear} DespesaPública.net. Todos os direitos reservados.
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
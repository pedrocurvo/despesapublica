import type { Metadata } from "next"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Shield, Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Política de Privacidade | Orçamento do Governo Português",
  description: "Política de privacidade e proteção de dados do Portal do Orçamento Português",
}

export default function PrivacyPage() {
  // Current year for the copyright notice
  const currentYear = new Date().getFullYear()

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 md:p-6">

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Política de Privacidade
            </CardTitle>
            <CardDescription>
              Última atualização: 25 de Abril de 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold">1. Introdução</h2>
                  <p className="mt-2 text-muted-foreground">
                    A sua privacidade é importante para nós. Esta Política de Privacidade explica como o Portal do Orçamento Português ("Portal", "nós" ou "nosso") recolhe, utiliza, armazena e protege as informações que recolhemos dos utilizadores ("utilizador" ou "você") do nosso portal web.
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Esta política está em conformidade com o Regulamento Geral de Proteção de Dados (RGPD) da União Europeia e a Lei de Proteção de Dados Pessoais portuguesa.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">2. Dados que Recolhemos</h2>
                  <p className="mt-2 text-muted-foreground">
                    Recolhemos os seguintes tipos de informação:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li><strong>Informações de Utilização:</strong> Dados anónimos sobre como os utilizadores interagem com o Portal, incluindo páginas visitadas, tempo gasto no site, padrões de cliques e preferências de visualização de dados.</li>
                    <li><strong>Informações Técnicas:</strong> Endereço IP, tipo de navegador, fornecedor de serviços de Internet, páginas de referência/saída, tipo de plataforma, data/hora e dados de navegação.</li>
                    <li><strong>Cookies e Tecnologias Semelhantes:</strong> Utilizamos cookies e tecnologias similares para melhorar a experiência do utilizador e recolher informações sobre a utilização do Portal.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">3. Como Utilizamos os Dados</h2>
                  <p className="mt-2 text-muted-foreground">
                    Utilizamos os dados recolhidos para:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Operar e melhorar o Portal</li>
                    <li>Analisar a utilização do Portal e melhorar a experiência do utilizador</li>
                    <li>Diagnosticar problemas técnicos e manter a segurança</li>
                    <li>Gerar estatísticas anónimas sobre como o Portal é utilizado</li>
                    <li>Monitorizar e prevenir atividades potencialmente proibidas ou ilegais</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">4. Base Legal para o Processamento</h2>
                  <p className="mt-2 text-muted-foreground">
                    Processamos os seus dados pessoais com base nas seguintes condições legais:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li><strong>Consentimento:</strong> Quando você concorda explicitamente com a recolha de determinados dados, como ao aceitar cookies não essenciais.</li>
                    <li><strong>Interesses Legítimos:</strong> Quando o processamento é necessário para os nossos interesses legítimos e não é ultrapassado pelos seus interesses, direitos e liberdades, como na melhoria dos nossos serviços.</li>
                    <li><strong>Obrigações Legais:</strong> Quando o processamento é necessário para cumprir uma obrigação legal à qual estamos sujeitos.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">5. Cookies e Tecnologias Semelhantes</h2>
                  <p className="mt-2 text-muted-foreground">
                    O nosso Portal utiliza cookies e tecnologias semelhantes para melhorar a experiência do utilizador e para recolher informações sobre a utilização do Portal. Os tipos de cookies que utilizamos incluem:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li><strong>Cookies Estritamente Necessários:</strong> Essenciais para o funcionamento do Portal.</li>
                    <li><strong>Cookies Analíticos/de Desempenho:</strong> Permitem-nos reconhecer e contar o número de visitantes e ver como os visitantes se movem pelo Portal.</li>
                    <li><strong>Cookies de Funcionalidade:</strong> Utilizados para o reconhecer quando volta ao Portal e para lembrar as suas preferências.</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Os utilizadores podem controlar e gerir os cookies nas definições do seu navegador.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">6. Partilha de Dados</h2>
                  <p className="mt-2 text-muted-foreground">
                    Não vendemos, trocamos ou transferimos informações pessoais dos utilizadores para terceiros, exceto nas seguintes circunstâncias:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Com fornecedores de serviços confiáveis que nos ajudam a operar o Portal e que estão contratualmente obrigados a manter a confidencialidade.</li>
                    <li>Quando acreditamos que a divulgação é necessária para cumprir a lei, fazer cumprir as nossas políticas, ou proteger os nossos direitos ou a segurança de outros.</li>
                    <li>Com o seu consentimento prévio para qualquer outra partilha não abrangida acima.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">7. Segurança dos Dados</h2>
                  <p className="mt-2 text-muted-foreground">
                    Implementamos medidas de segurança apropriadas para proteger contra acesso não autorizado, alteração, divulgação ou destruição não autorizada das informações. Estas medidas incluem:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Utilização de encriptação SSL para transmissão de dados</li>
                    <li>Acesso restrito a informações pessoais</li>
                    <li>Monitorização regular de sistemas para detetar vulnerabilidades</li>
                    <li>Manutenção de procedimentos de backup seguros</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">8. Retenção de Dados</h2>
                  <p className="mt-2 text-muted-foreground">
                    Retemos os dados recolhidos apenas pelo tempo necessário para cumprir os fins para os quais foram recolhidos, incluindo quaisquer requisitos legais, contabilísticos ou de relatórios.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">9. Os Seus Direitos</h2>
                  <p className="mt-2 text-muted-foreground">
                    Em conformidade com o RGPD e a legislação portuguesa de proteção de dados, os utilizadores têm os seguintes direitos:
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Direito de acesso às informações pessoais que mantemos sobre si</li>
                    <li>Direito de retificação ou atualização de dados pessoais imprecisos</li>
                    <li>Direito ao apagamento (direito a ser esquecido)</li>
                    <li>Direito à restrição de processamento</li>
                    <li>Direito à portabilidade de dados</li>
                    <li>Direito de oposição ao processamento</li>
                    <li>Direitos relacionados com a tomada de decisões e criação de perfis automatizados</li>
                  </ul>
                  <p className="mt-2 text-muted-foreground">
                    Para exercer estes direitos, entre em contacto connosco através do email fornecido abaixo.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">10. Alterações à Política de Privacidade</h2>
                  <p className="mt-2 text-muted-foreground">
                    Podemos atualizar esta política periodicamente. As alterações serão publicadas nesta página com uma nova data de "Última atualização". Recomendamos que os utilizadores consultem regularmente esta página para se manterem informados sobre as nossas práticas de privacidade.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">11. Contato</h2>
                  <p className="mt-2 text-muted-foreground">
                    Para questões relacionadas com esta Política de Privacidade ou com as nossas práticas de dados, por favor contacte-nos através do email: <a href="mailto:privacy@portaldoorcamento.pt" className="text-blue-500 hover:underline">privacy@portaldoorcamento.pt</a>
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">12. Autoridade de Supervisão</h2>
                  <p className="mt-2 text-muted-foreground">
                    Se acredita que o nosso processamento de informações pessoais viola a legislação de proteção de dados, tem o direito de apresentar uma reclamação junto da Comissão Nacional de Proteção de Dados (CNPD), a autoridade de supervisão de proteção de dados em Portugal.
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
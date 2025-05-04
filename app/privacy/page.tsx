import type { Metadata } from "next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Política de Privacidade | DespesaPública.net",
  description: "Esta Plataforma apenas visualiza dados públicos e não recolhe informações pessoais dos utilizadores.",
};

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

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
              Última atualização: 25 de abril de {currentYear}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">

                <div>
                  <h2 className="text-xl font-semibold">1. Introdução</h2>
                  <p className="mt-2 text-muted-foreground">
                    A sua privacidade é importante para nós. Esta Política de Privacidade descreve como a DespesaPública.net ("Plataforma", "nós" ou "nossa") lida com as informações dos utilizadores ("você").
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Esta Plataforma foi concebido apenas para visualizar dados públicos através de gráficos interativos. <strong>Não recolhemos nem armazenamos informações pessoais.</strong>
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">2. Dados que Recolhemos</h2>
                  <p className="mt-2 text-muted-foreground">
                    <strong>Não recolhemos dados pessoais.</strong>
                  </p>
                  <ul className="mt-2 ml-6 list-disc text-muted-foreground">
                    <li>Não solicitamos informações de identificação pessoal.</li>
                    <li>Não recolhemos endereços IP nem dados de navegação.</li>
                    <li>Não utilizamos cookies nem tecnologias de rastreamento.</li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">3. Finalidade do DespesaPública.net</h2>
                  <p className="mt-2 text-muted-foreground">
                    O único objetivo da Plataforma é <strong>exibir informação pública</strong> de forma visual e acessível.
                    Não realizamos atividades de marketing, perfis de utilizadores ou recolha de dados.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">4. Segurança</h2>
                  <p className="mt-2 text-muted-foreground">
                    Embora não recolhamos dados pessoais, implementamos medidas de segurança apropriadas para proteger a integridade da Plataforma contra acessos ou alterações não autorizadas.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">5. Alterações a esta Política</h2>
                  <p className="mt-2 text-muted-foreground">
                    Podemos atualizar esta Política de Privacidade periodicamente. As alterações serão refletidas nesta página com a respetiva data de atualização.
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">6. Contacto</h2>
                  <p className="mt-2 text-muted-foreground">
                    Para qualquer questão relacionada com esta Política de Privacidade, por favor contacte-nos através do email:{" "}
                    <a href="mailto:privacy@DespesaPública.net" className="text-blue-500 hover:underline">
                      privacy@DespesaPública.net
                    </a>
                  </p>
                </div>

                <Separator />

                <div>
                  <h2 className="text-xl font-semibold">7. Autoridade de Supervisão</h2>
                  <p className="mt-2 text-muted-foreground">
                    Se considerar que o nosso tratamento de informações viola a legislação de proteção de dados aplicável, poderá apresentar uma reclamação junto da Comissão Nacional de Proteção de Dados (CNPD) em Portugal.
                  </p>
                </div>

                <div className="pt-4 text-center text-sm text-muted-foreground">
                  © {currentYear} DespesaPública.net Todos os direitos reservados.
                </div>

              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
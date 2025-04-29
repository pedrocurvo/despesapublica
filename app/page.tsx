import ClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "DespesaPública.pt - Como São Usados Os Nossos Impostos?",
  description: "Explore facilmente como o dinheiro público é gasto em Portugal — por setor, medidas do programa e região. Acompanhe as decisões do governo com clareza e transparência.",
}

export default function Page() {
  return <ClientPage />
}

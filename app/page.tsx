import ClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Painel do Orçamento do Governo Português",
  description: "Visualize e analise dados do orçamento do governo português",
}

export default function Page() {
  return <ClientPage />
}

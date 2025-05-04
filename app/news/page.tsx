import News from './News'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notícias sobre a Execução Orçamental em Portugal | DespesaPública.net ",
  description: "Acompanhe as últimas notícias e artigos relacionados com a execução do orçamento do governo português, organizados por ano e setor.",
  keywords: "notícias, execução orçamental, orçamento, governo português, despesa pública, artigos, atualizações",
}

export default function NewsPage() {
  return <News />
}
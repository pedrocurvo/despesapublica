import MainComparePage from "./ComparePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar Despesas por Ano, Setor, Medidas do Programa e Distritos| DespesaPública.net",
  description: "Compara a evolução da despesa pública entre diferentes anos, setores, distritos e municípios — visualize tendências e variações no orçamento do governo português.",
  keywords: "comparar orçamento, despesas públicas, anos, setores, distritos, municípios, finanças públicas, portugal",
};

export default function DespesaPage() {
  return <MainComparePage />
    
}


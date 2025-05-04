import MainDespesaPage from "./DespesaPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Despesa por Setor e Medidas do Programa Orçamental | DespesaPública.net",
  description: "Explore a alocação do orçamento público por setor, programa e medida — visualize como o governo distribui e executa a despesa em Portugal.",
  keywords: "despesa pública, orçamento por setor, programas governamentais, medidas orçamentais, finanças públicas, portugal",
};

export default function DespesaPage() {
  return <MainDespesaPage />
    
}
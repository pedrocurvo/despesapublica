import ClientPage from "./ClientPage"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Portuguese Government Budget Dashboard",
  description: "Visualize and analyze Portuguese government budget data",
}

export default function Page() {
  return <ClientPage />
}

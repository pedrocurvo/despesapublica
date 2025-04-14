"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SectorsContextType = {
  selectedSectors: string[]
  setSelectedSectors: (sectors: string[]) => void
}

const SectorsContext = createContext<SectorsContextType | undefined>(undefined)

export function SectorsProvider({ children }: { children: ReactNode }) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>(["education", "healthcare", "defense"])

  return (
    <SectorsContext.Provider value={{ selectedSectors, setSelectedSectors }}>
      {children}
    </SectorsContext.Provider>
  )
}

export function useSectors() {
  const context = useContext(SectorsContext)
  if (context === undefined) {
    throw new Error("useSectors must be used within a SectorsProvider")
  }
  return context
}
"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { DateRange } from "react-day-picker"

type DateRangeContextType = {
  dateRange: DateRange | undefined
  setDateRange: (dateRange: DateRange | undefined) => void
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined)

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2018, 0, 1),
    to: new Date(),
  })

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export function useDateRange() {
  const context = useContext(DateRangeContext)
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider")
  }
  return context
}
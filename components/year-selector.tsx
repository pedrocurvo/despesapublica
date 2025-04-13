"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const years = [
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2019", label: "2019" },
  { value: "2018", label: "2018" },
]

interface YearSelectorProps {
  onYearsChange?: (years: string[]) => void
}

export function YearSelector({ onYearsChange }: YearSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedYears, setSelectedYears] = useState<string[]>(["2023", "2022"])

  useEffect(() => {
    if (onYearsChange) {
      onYearsChange(selectedYears)
    }
  }, [selectedYears, onYearsChange])

  const toggleYear = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter((y) => y !== year))
    } else {
      if (selectedYears.length < 3) {
        setSelectedYears([...selectedYears, year])
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {selectedYears.length > 0 ? `${selectedYears.join(", ")}` : "Select years..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search years..." />
          <CommandList>
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup>
              {years.map((year) => (
                <CommandItem key={year.value} value={year.value} onSelect={() => toggleYear(year.value)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedYears.includes(year.value) ? "opacity-100" : "opacity-0")}
                  />
                  {year.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

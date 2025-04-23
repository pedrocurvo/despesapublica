"use client"

import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useSectors } from "@/lib/sectors-context"

const sectors = [
  { value: "education", label: "Educação" },
  { value: "healthcare", label: "Saúde" },
  { value: "social-security", label: "Segurança Social" },
  { value: "infrastructure", label: "Infraestrutura" },
  { value: "defense", label: "Defesa" },
  { value: "justice", label: "Justiça" },
  { value: "environment", label: "Ambiente" },
  { value: "culture", label: "Cultura" },
]

export function SectorSelector() {
  const [open, setOpen] = useState(false)
  const { selectedSectors, setSelectedSectors } = useSectors()

  const toggleSector = (sector: string) => {
    if (selectedSectors.includes(sector)) {
      setSelectedSectors(selectedSectors.filter((s) => s !== sector))
    } else {
      if (selectedSectors.length < 4) {
        setSelectedSectors([...selectedSectors, sector])
      }
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between">
          {selectedSectors.length > 0 ? `${selectedSectors.length} setores selecionados` : "Selecionar setores..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Pesquisar setores..." />
          <CommandList>
            <CommandEmpty>Nenhum setor encontrado.</CommandEmpty>
            <CommandGroup>
              {sectors.map((sector) => (
                <CommandItem key={sector.value} value={sector.value} onSelect={() => toggleSector(sector.value)}>
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedSectors.includes(sector.value) ? "opacity-100" : "opacity-0")}
                  />
                  {sector.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

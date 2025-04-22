"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface BudgetYearSelectorProps {
  currentYear: string;
  onYearChange: (year: string) => void;
  availableYears?: string[];
}

export default function BudgetYearSelector({
  currentYear,
  onYearChange,
  availableYears = ["2023"]
}: BudgetYearSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex items-center gap-2 w-36 justify-between"
        >
          <span>{currentYear}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-0">
        <div className="max-h-60 overflow-auto">
          {availableYears.map((year) => (
            <div
              key={year}
              className={cn(
                "relative flex cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                currentYear === year && "bg-accent text-accent-foreground"
              )}
              onClick={() => {
                onYearChange(year);
                setOpen(false);
              }}
            >
              <span>{year}</span>
              {currentYear === year && <Check className="h-4 w-4 ml-auto" />}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
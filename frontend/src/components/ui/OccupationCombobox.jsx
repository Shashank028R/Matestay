// frontend/src/components/ui/OccupationCombobox.jsx

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { occupations } from "@/lib/occupationList" // Import our occupation list

export function OccupationCombobox({ value, onChange }) {
  const [open, setOpen] = React.useState(false)

  const displayLabel = occupations.find(
    (occupation) => occupation.value.toLowerCase() === value?.toLowerCase()
  )?.label || "Select occupation..."

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? displayLabel : "Select occupation..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search occupation..." />
          <CommandList>
            <CommandEmpty>No occupation found.</CommandEmpty>
            <CommandGroup>
              {occupations.map((occupation) => (
                <CommandItem
                  key={occupation.value}
                  value={occupation.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === occupation.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {occupation.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
// frontend/src/components/ui/LocationCombobox.jsx

"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { locations } from "@/lib/indianLocations" // Import our location list

export function LocationCombobox({ value, onChange }) {
  const [open, setOpen] = React.useState(false)

  // This finds the full "label" (e.g., "Dehradun, Uttarakhand") 
  // from the saved "value" (which might just be "Dehradun, Uttarakhand").
  const displayLabel = locations.find(
    (location) => location.value.toLowerCase() === value?.toLowerCase()
  )?.label || "Select location..."

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? displayLabel : "Select location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    // When a user selects an item:
                    // 1. Set the form value (or clear it if they re-select the same one)
                    onChange(currentValue === value ? "" : currentValue)
                    // 2. Close the popover
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === location.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
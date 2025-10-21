import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// This component now takes a function prop to send its data to the parent
const FilterBar = ({ onApplyFilters }) => {
  // Internal state to track filter values before applying
  const [budget, setBudget] = useState(50000); // Default max budget
  const [gender, setGender] = useState("Any");

  const handleApply = () => {
    onApplyFilters({
      maxBudget: budget,
      gender: gender,
    });
  };

  const handleClear = () => {
    setBudget(50000);
    setGender("Any");
    onApplyFilters({
      maxBudget: 50000,
      gender: "Any",
    });
  };

  return (
    <section id="search-filters" className="py-12 bg-secondary/30">
      <div className="container mx-auto px-8 sm:px-12 lg:px-20">
        <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h3 className="text-xl font-semibold mb-6">Refine Your Search</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            
            {/* --- FILTER 1: GENDER --- */}
            <div>
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- FILTER 2: BUDGET SLIDER --- */}
            <div className="md:col-span-1">
              <Label className="mb-2 block text-sm font-medium text-muted-foreground">
                Max Budget: <span className="font-bold text-primary">₹{budget.toLocaleString()}</span>
              </Label>
              <Slider
                value={[budget]}
                onValueChange={(value) => setBudget(value[0])}
                max={50000}
                min={1000}
                step={1000}
              />
            </div>
            
            {/* --- BUTTONS --- */}
            <div className="flex gap-2">
              <Button onClick={handleApply} className="w-full bg-[#5b5dda] hover:bg-[#4a4ab5]">
                Apply Filters
              </Button>
              <Button onClick={handleClear} variant="ghost" className="w-full">
                Clear
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
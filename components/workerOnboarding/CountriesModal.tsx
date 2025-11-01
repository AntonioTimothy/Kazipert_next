"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search, Check } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const countriesList = [
  "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Oman", "Bahrain",
  "United States", "United Kingdom", "Canada", "Australia", "South Africa",
  "Other"
].sort()

interface CountriesModalProps {
  selectedCountries: string[]
  onUpdate: (countries: string[]) => void
  onClose: () => void
}

export default function CountriesModal({ selectedCountries, onUpdate, onClose }: CountriesModalProps) {
  const [search, setSearch] = useState("")

  const filteredCountries = countriesList.filter(country =>
    country.toLowerCase().includes(search.toLowerCase())
  )

  const toggleCountry = (country: string) => {
    const currentCountries = [...selectedCountries]
    if (currentCountries.includes(country)) {
      onUpdate(currentCountries.filter(c => c !== country))
    } else {
      onUpdate([...currentCountries, country])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-theme-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-theme-transition">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <div>
            <h2 className="text-xl font-bold text-theme-text">Select Countries Worked In</h2>
            <p className="text-theme-text-muted text-sm mt-1">Choose all countries where you have worked</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-theme-primary/10 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-theme-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
            <Input
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-4 max-h-[40vh] overflow-y-auto">
          <div className="space-y-2">
            {filteredCountries.map((country) => (
              <div
                key={country}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                  selectedCountries.includes(country)
                    ? "border-theme-primary bg-theme-primary/10"
                    : "border-theme-border hover:border-theme-primary"
                )}
                onClick={() => toggleCountry(country)}
              >
                <div className={cn(
                  "h-4 w-4 rounded border flex items-center justify-center",
                  selectedCountries.includes(country)
                    ? "bg-theme-primary border-theme-primary"
                    : "border-theme-border"
                )}>
                  {selectedCountries.includes(country) && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{country}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-theme-border">
          <Button
            onClick={onClose}
            className="w-full bg-theme-primary text-white"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
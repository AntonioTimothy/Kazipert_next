"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Search } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const kenyaCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa",
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu",
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a",
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu",
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu",
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
].sort()

interface CountyModalProps {
  onSelect: (county: string) => void
  onClose: () => void
}

export default function CountyModal({ onSelect, onClose }: CountyModalProps) {
  const [search, setSearch] = useState("")

  const filteredCounties = kenyaCounties.filter(county =>
    county.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-theme-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden animate-theme-transition">
        <div className="flex items-center justify-between p-6 border-b border-theme-border">
          <div>
            <h2 className="text-xl font-bold text-theme-text">Select County of Residence</h2>
            <p className="text-theme-text-muted text-sm mt-1">Choose your county from the list below</p>
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
              placeholder="Search counties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto">
            {filteredCounties.map((county) => (
              <button
                key={county}
                onClick={() => {
                  onSelect(county)
                  onClose()
                }}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all duration-200 hover:scale-105",
                  "border-theme-border hover:border-theme-primary hover:bg-theme-primary/5"
                )}
              >
                {county}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
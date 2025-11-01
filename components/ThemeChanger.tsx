"use client"

import { useTheme } from '@/contexts/ThemeContext'
import { Button } from "@/components/ui/button"
import { Palette, Check, X, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

export function ThemeChanger() {
  const { 
    currentTheme, 
    themes, 
    setTheme, 
    isThemeChangerOpen, 
    setIsThemeChangerOpen 
  } = useTheme()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Filter themes based on search and category
  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || theme.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ["all", ...new Set(themes.map(theme => theme.category))]

  return (
    <>
      {/* Theme Changer Trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-theme-primary/10 transition-all rounded-lg group"
        onClick={() => setIsThemeChangerOpen(!isThemeChangerOpen)}
      >
        <Palette className="h-4 w-4 text-theme-primary group-hover:text-theme-primary-dark transition-colors" />
      </Button>

      {/* Theme Changer Overlay */}
      {isThemeChangerOpen && (
        <div className="fixed inset-0 z-[10000] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 pb-4 px-4">
          <div className="bg-theme-background border border-theme-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[calc(100vh-6rem)] overflow-hidden animate-theme-transition">
            {/* Header - Compact */}
            <div className="flex items-center justify-between p-4 border-b border-theme-border bg-theme-background-light sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center">
                  <Palette className="h-4 w-4 text-theme-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-theme-text">Choose Theme</h2>
                  <p className="text-theme-text-muted text-xs mt-0.5">
                    {themes.length} themes available
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsThemeChangerOpen(false)}
                className="h-8 w-8 hover:bg-theme-primary/10 rounded-lg transition-colors"
              >
                <X className="h-3.5 w-3.5 text-theme-text" />
              </Button>
            </div>

            {/* Search and Filter Section - Compact */}
            <div className="p-4 border-b border-theme-border bg-theme-background-light/30 sticky top-14 z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-theme-text-muted" />
                  <input
                    type="text"
                    placeholder="Search themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary/30 focus:border-theme-primary text-theme-text placeholder-theme-text-muted"
                  />
                </div>
                
                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-sm bg-theme-background border border-theme-border rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-primary/30 focus:border-theme-primary text-theme-text capitalize min-w-32"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="capitalize text-sm">
                      {category === "all" ? "All" : category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Results Count */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-theme-text-muted">
                  {filteredThemes.length} of {themes.length} themes
                </span>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="h-6 text-xs text-theme-primary hover:bg-theme-primary/10 px-2"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Themes List - Compact with proper height calculation */}
            <div className="p-4 max-h-[calc(100vh-18rem)] overflow-y-auto">
              <div className="space-y-2">
                {filteredThemes.length > 0 ? (
                  filteredThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setTheme(theme.id)}
                      className={cn(
                        "w-full p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] group",
                        currentTheme.id === theme.id 
                          ? "border-theme-primary bg-theme-primary/5 shadow-sm" 
                          : "border-theme-border hover:border-theme-primary/30 bg-theme-background"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {/* Theme Color Preview - Smaller */}
                        <div className="flex-shrink-0">
                          <div className="flex items-center gap-1.5">
                            <div 
                              className="w-8 h-8 rounded border border-theme-border"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div className="flex flex-col gap-0.5">
                              <div 
                                className="w-4 h-3 rounded border border-theme-border"
                                style={{ backgroundColor: theme.colors.primaryLight }}
                              />
                              <div 
                                className="w-4 h-3 rounded border border-theme-border"
                                style={{ backgroundColor: theme.colors.primaryDark }}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Theme Info - Smaller text */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-medium text-theme-text text-sm truncate">
                              {theme.name}
                            </h3>
                            <span 
                              className={cn(
                                "px-1.5 py-0.5 rounded-full text-xs font-medium capitalize",
                                currentTheme.id === theme.id
                                  ? "bg-theme-primary text-white"
                                  : "bg-theme-background-light text-theme-text-muted"
                              )}
                            >
                              {theme.category}
                            </span>
                          </div>
                          <div className="flex gap-1.5 mt-1.5">
                            <div 
                              className="w-3 h-3 rounded border border-theme-border"
                              style={{ backgroundColor: theme.colors.background }}
                              title="Background"
                            />
                            <div 
                              className="w-3 h-3 rounded border border-theme-border"
                              style={{ backgroundColor: theme.colors.text }}
                              title="Text"
                            />
                            <div 
                              className="w-3 h-3 rounded border border-theme-border"
                              style={{ backgroundColor: theme.colors.border }}
                              title="Border"
                            />
                            <div 
                              className="w-3 h-3 rounded border border-theme-border"
                              style={{ backgroundColor: theme.colors.accent }}
                              title="Accent"
                            />
                          </div>
                        </div>

                        {/* Selection Indicator - Smaller */}
                        <div className="flex-shrink-0">
                          {currentTheme.id === theme.id ? (
                            <div 
                              className="h-6 w-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-200"
                              style={{ backgroundColor: theme.colors.primary }}
                            >
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border border-theme-border bg-theme-background-light group-hover:border-theme-primary/30 transition-colors" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  /* Empty State - Compact */
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-full bg-theme-background-light border border-theme-border flex items-center justify-center mx-auto mb-3">
                      <Palette className="h-5 w-5 text-theme-text-muted" />
                    </div>
                    <h3 className="text-sm font-semibold text-theme-text mb-1">No themes found</h3>
                    <p className="text-theme-text-muted text-xs mb-3">
                      Try a different search or category
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("")
                        setSelectedCategory("all")
                      }}
                      className="h-7 text-xs border-theme-border hover:bg-theme-primary/10"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Current Theme Preview - Compact */}
            <div className="p-4 border-t border-theme-border bg-theme-background-light/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-theme-text text-xs mb-0.5">Current Theme</h4>
                  <p className="text-theme-text-muted text-xs">
                    {currentTheme.name}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div 
                    className="w-4 h-4 rounded border border-theme-border"
                    style={{ backgroundColor: currentTheme.colors.primary }}
                  />
                  <div 
                    className="w-4 h-4 rounded border border-theme-border"
                    style={{ backgroundColor: currentTheme.colors.background }}
                  />
                  <div 
                    className="w-4 h-4 rounded border border-theme-border"
                    style={{ backgroundColor: currentTheme.colors.text }}
                  />
                </div>
              </div>
            </div>

            {/* Footer - Compact */}
            <div className="p-4 border-t border-theme-border bg-theme-background-light">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-theme-text-muted text-center sm:text-left flex-1">
                  Changes apply instantly and are saved automatically
                </p>
                <Button
                  onClick={() => setIsThemeChangerOpen(false)}
                  size="sm"
                  className="bg-theme-primary hover:bg-theme-primary-dark text-white px-4 text-sm h-8"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
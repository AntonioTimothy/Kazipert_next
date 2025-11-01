"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

export type Theme = {
  id: string
  name: string
  category: 'professional' | 'modern' | 'creative' | 'minimal' | 'accessible'
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    background: string
    backgroundLight: string
    text: string
    textMuted: string
    border: string
    accent: string
    success: string
    warning: string
    error: string
    surface: string
    surfaceHover: string
  }
}

export const defaultThemes: Theme[] = [
  // PROFESSIONAL THEMES
  {
    id: 'corporate-sapphire',
    name: 'Corporate Sapphire',
    category: 'professional',
    colors: {
      primary: '#2563eb',
      primaryLight: '#dbeafe',
      primaryDark: '#1e40af',
      background: '#ffffff',
      backgroundLight: '#f8fafc',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#e2e8f0',
      accent: '#06b6d4',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      surface: '#ffffff',
      surfaceHover: '#f1f5f9'
    }
  },
  {
    id: 'executive-charcoal',
    name: 'Executive Charcoal',
    category: 'professional',
    colors: {
      primary: '#374151',
      primaryLight: '#f3f4f6',
      primaryDark: '#1f2937',
      background: '#ffffff',
      backgroundLight: '#f9fafb',
      text: '#111827',
      textMuted: '#6b7280',
      border: '#d1d5db',
      accent: '#7c3aed',
      success: '#047857',
      warning: '#b45309',
      error: '#b91c1c',
      surface: '#ffffff',
      surfaceHover: '#f3f4f6'
    }
  },
  {
    id: 'banking-emerald',
    name: 'Banking Emerald',
    category: 'professional',
    colors: {
      primary: '#059669',
      primaryLight: '#d1fae5',
      primaryDark: '#047857',
      background: '#ffffff',
      backgroundLight: '#f0fdf4',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#d1fae5',
      accent: '#0d9488',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      surface: '#ffffff',
      surfaceHover: '#ecfdf5'
    }
  },

  // MODERN THEMES
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    category: 'modern',
    colors: {
      primary: '#06b6d4',
      primaryLight: '#cffafe',
      primaryDark: '#0891b2',
      background: '#0f172a',
      backgroundLight: '#1e293b',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      accent: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      surface: '#1e293b',
      surfaceHover: '#334155'
    }
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    category: 'modern',
    colors: {
      primary: '#6366f1',
      primaryLight: '#e0e7ff',
      primaryDark: '#4f46e5',
      background: 'rgba(255, 255, 255, 0.9)',
      backgroundLight: 'rgba(255, 255, 255, 0.7)',
      text: '#1e293b',
      textMuted: '#64748b',
      border: 'rgba(99, 102, 241, 0.2)',
      accent: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      surface: 'rgba(255, 255, 255, 0.6)',
      surfaceHover: 'rgba(255, 255, 255, 0.8)'
    }
  },
  {
    id: 'midnight-azure',
    name: 'Midnight Azure',
    category: 'modern',
    colors: {
      primary: '#3b82f6',
      primaryLight: '#1e40af',
      primaryDark: '#1e3a8a',
      background: '#0f172a',
      backgroundLight: '#1e293b',
      text: '#f8fafc',
      textMuted: '#cbd5e1',
      border: '#334155',
      accent: '#06b6d4',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      surface: '#1e293b',
      surfaceHover: '#334155'
    }
  },

  // CREATIVE THEMES
  {
    id: 'creative-gradient',
    name: 'Creative Gradient',
    category: 'creative',
    colors: {
      primary: '#8b5cf6',
      primaryLight: '#ddd6fe',
      primaryDark: '#7c3aed',
      background: '#ffffff',
      backgroundLight: '#faf5ff',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#c4b5fd',
      accent: '#ec4899',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      surface: '#ffffff',
      surfaceHover: '#faf5ff'
    }
  },
  {
    id: 'sunset-vibes',
    name: 'Sunset Vibes',
    category: 'creative',
    colors: {
      primary: '#f97316',
      primaryLight: '#ffedd5',
      primaryDark: '#ea580c',
      background: '#ffffff',
      backgroundLight: '#fff7ed',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#fdba74',
      accent: '#eab308',
      success: '#22c55e',
      warning: '#eab308',
      error: '#ef4444',
      surface: '#ffffff',
      surfaceHover: '#fff7ed'
    }
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    category: 'creative',
    colors: {
      primary: '#dc2626',
      primaryLight: '#fecaca',
      primaryDark: '#b91c1c',
      background: '#fefce8',
      backgroundLight: '#fef9c3',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#fca5a5',
      accent: '#d97706',
      success: '#16a34a',
      warning: '#d97706',
      error: '#dc2626',
      surface: '#fefce8',
      surfaceHover: '#fef9c3'
    }
  },

  // MINIMAL THEMES
  {
    id: 'pure-minimal',
    name: 'Pure Minimal',
    category: 'minimal',
    colors: {
      primary: '#6b7280',
      primaryLight: '#f3f4f6',
      primaryDark: '#4b5563',
      background: '#ffffff',
      backgroundLight: '#fafafa',
      text: '#1f2937',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      accent: '#9ca3af',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      surface: '#ffffff',
      surfaceHover: '#f9fafb'
    }
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    category: 'minimal',
    colors: {
      primary: '#4b5563',
      primaryLight: '#f3f4f6',
      primaryDark: '#374151',
      background: '#ffffff',
      backgroundLight: '#f8fafc',
      text: '#1f2937',
      textMuted: '#6b7280',
      border: '#e5e7eb',
      accent: '#6b7280',
      success: '#374151',
      warning: '#6b7280',
      error: '#374151',
      surface: '#ffffff',
      surfaceHover: '#f9fafb'
    }
  },
  {
    id: 'paper-white',
    name: 'Paper White',
    category: 'minimal',
    colors: {
      primary: '#d1d5db',
      primaryLight: '#f9fafb',
      primaryDark: '#9ca3af',
      background: '#ffffff',
      backgroundLight: '#fefefe',
      text: '#374151',
      textMuted: '#9ca3af',
      border: '#e5e7eb',
      accent: '#9ca3af',
      success: '#6b7280',
      warning: '#9ca3af',
      error: '#6b7280',
      surface: '#ffffff',
      surfaceHover: '#f9fafb'
    }
  },

  // ACCESSIBLE THEMES (High Contrast)
  {
    id: 'high-contrast',
    name: 'High Contrast',
    category: 'accessible',
    colors: {
      primary: '#000000',
      primaryLight: '#404040',
      primaryDark: '#000000',
      background: '#ffffff',
      backgroundLight: '#f0f0f0',
      text: '#000000',
      textMuted: '#404040',
      border: '#000000',
      accent: '#0000ff',
      success: '#008000',
      warning: '#ffa500',
      error: '#ff0000',
      surface: '#ffffff',
      surfaceHover: '#f0f0f0'
    }
  },
  {
    id: 'accessible-blue',
    name: 'Accessible Blue',
    category: 'accessible',
    colors: {
      primary: '#0056b3',
      primaryLight: '#e6f0ff',
      primaryDark: '#004085',
      background: '#ffffff',
      backgroundLight: '#f8f9fa',
      text: '#212529',
      textMuted: '#6c757d',
      border: '#0056b3',
      accent: '#004085',
      success: '#155724',
      warning: '#856404',
      error: '#721c24',
      surface: '#ffffff',
      surfaceHover: '#e6f0ff'
    }
  },
  {
    id: 'colorblind-friendly',
    name: 'Colorblind Friendly',
    category: 'accessible',
    colors: {
      primary: '#2b8cbe',
      primaryLight: '#e8f0f7',
      primaryDark: '#0868ac',
      background: '#ffffff',
      backgroundLight: '#f7f7f7',
      text: '#252525',
      textMuted: '#636363',
      border: '#969696',
      accent: '#88419d',
      success: '#31a354',
      warning: '#e6550d',
      error: '#e31a1c',
      surface: '#ffffff',
      surfaceHover: '#f0f0f0'
    }
  },

  // KAZIPERT BRAND THEMES
  {
    id: 'kazipert-teal',
    name: 'Kazipert Teal',
    category: 'professional',
    colors: {
      primary: '#0d9488',
      primaryLight: '#ccfbf1',
      primaryDark: '#0f766e',
      background: '#ffffff',
      backgroundLight: '#f0fdfa',
      text: '#1e293b',
      textMuted: '#64748b',
      border: '#99f6e4',
      accent: '#06b6d4',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      surface: '#ffffff',
      surfaceHover: '#f0fdfa'
    }
  },
  {
    id: 'kazipert-modern',
    name: 'Kazipert Modern',
    category: 'modern',
    colors: {
      primary: '#6366f1',
      primaryLight: '#e0e7ff',
      primaryDark: '#4f46e5',
      background: '#0f172a',
      backgroundLight: '#1e293b',
      text: '#f1f5f9',
      textMuted: '#94a3b8',
      border: '#334155',
      accent: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      surface: '#1e293b',
      surfaceHover: '#334155'
    }
  }
]

// Theme categories for organization
export const themeCategories = [
  { id: 'professional', name: 'Professional', description: 'Corporate and business-focused themes' },
  { id: 'modern', name: 'Modern', description: 'Contemporary and trendy designs' },
  { id: 'creative', name: 'Creative', description: 'Vibrant and expressive color schemes' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and simplistic designs' },
  { id: 'accessible', name: 'Accessible', description: 'High contrast and colorblind friendly' }
]

interface ThemeContextType {
  currentTheme: Theme
  themes: Theme[]
  setTheme: (themeId: string) => void
  isThemeChangerOpen: boolean
  setIsThemeChangerOpen: (open: boolean) => void
  getThemesByCategory: (category: string) => Theme[]
  searchThemes: (query: string) => Theme[]
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultThemes.find(t => t.id === 'kazipert-teal') || defaultThemes[0])
  const [isThemeChangerOpen, setIsThemeChangerOpen] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedThemeId = localStorage.getItem('kazipert-theme')
    if (savedThemeId) {
      const savedTheme = defaultThemes.find(theme => theme.id === savedThemeId)
      if (savedTheme) {
        setCurrentTheme(savedTheme)
      }
    }
  }, [])

  const setTheme = (themeId: string) => {
    const theme = defaultThemes.find(t => t.id === themeId) || defaultThemes[0]
    setCurrentTheme(theme)
    localStorage.setItem('kazipert-theme', themeId)
    setIsThemeChangerOpen(false)
    
    // Add theme transition class to body for smooth transition
    document.body.classList.add('theme-transitioning')
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning')
    }, 300)
  }

  const getThemesByCategory = (category: string) => {
    return defaultThemes.filter(theme => theme.category === category)
  }

  const searchThemes = (query: string) => {
    const lowerQuery = query.toLowerCase()
    return defaultThemes.filter(theme => 
      theme.name.toLowerCase().includes(lowerQuery) ||
      theme.category.toLowerCase().includes(lowerQuery) ||
      theme.id.toLowerCase().includes(lowerQuery)
    )
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themes: defaultThemes,
      setTheme,
      isThemeChangerOpen,
      setIsThemeChangerOpen,
      getThemesByCategory,
      searchThemes
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Utility function to check contrast ratio for accessibility
export function getContrastRatio(color1: string, color2: string): number {
  // Simple contrast ratio calculation (for demonstration)
  // In production, use a proper color contrast library
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)
  
  const luminance1 = (0.299 * rgb1.r + 0.587 * rgb1.g + 0.114 * rgb1.b) / 255
  const luminance2 = (0.299 * rgb2.r + 0.587 * rgb2.g + 0.114 * rgb2.b) / 255
  
  const brightest = Math.max(luminance1, luminance2)
  const darkest = Math.min(luminance1, luminance2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

// Theme validation function
export function validateThemeAccessibility(theme: Theme): {
  isValid: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  // Check text contrast ratios
  const textBackgroundRatio = getContrastRatio(theme.colors.text, theme.colors.background)
  if (textBackgroundRatio < 4.5) {
    issues.push('Text contrast ratio below WCAG AA standard')
  }
  
  const primaryBackgroundRatio = getContrastRatio(theme.colors.primary, theme.colors.background)
  if (primaryBackgroundRatio < 3) {
    issues.push('Primary color contrast ratio below minimum standard')
  }
  
  // Check if colors are distinct enough
  if (theme.colors.primary === theme.colors.accent) {
    issues.push('Primary and accent colors are too similar')
  }
  
  return {
    isValid: issues.length === 0,
    issues
  }
}
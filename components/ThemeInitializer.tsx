"use client"

import { useTheme } from '@/contexts/ThemeContext'
import { applyThemeToDocument } from '@/lib/theme-utils'
import { useEffect } from 'react'

export function ThemeInitializer() {
  const { currentTheme } = useTheme()

  useEffect(() => {
    applyThemeToDocument(currentTheme)
  }, [currentTheme])

  return null
}
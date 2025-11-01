import { Theme } from '@/contexts/ThemeContext'

export function generateThemeCSSVariables(theme: Theme): string {
    return `
    --color-primary: ${theme.colors.primary};
    --color-primary-light: ${theme.colors.primaryLight};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-background: ${theme.colors.background};
    --color-background-light: ${theme.colors.backgroundLight};
    --color-text: ${theme.colors.text};
    --color-text-muted: ${theme.colors.textMuted};
    --color-border: ${theme.colors.border};
    --color-accent: ${theme.colors.accent};
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-error: ${theme.colors.error};
  `
}

export function applyThemeToDocument(theme: Theme) {
    const root = document.documentElement
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight)
    root.style.setProperty('--color-primary-dark', theme.colors.primaryDark)
    root.style.setProperty('--color-background', theme.colors.background)
    root.style.setProperty('--color-background-light', theme.colors.backgroundLight)
    root.style.setProperty('--color-text', theme.colors.text)
    root.style.setProperty('--color-text-muted', theme.colors.textMuted)
    root.style.setProperty('--color-border', theme.colors.border)
    root.style.setProperty('--color-accent', theme.colors.accent)
    root.style.setProperty('--color-success', theme.colors.success)
    root.style.setProperty('--color-warning', theme.colors.warning)
    root.style.setProperty('--color-error', theme.colors.error)
}
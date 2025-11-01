const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addUtilities, theme }) {
  const newUtilities = {
    '.bg-primary': {
      backgroundColor: 'var(--color-primary)',
    },
    '.bg-primary-light': {
      backgroundColor: 'var(--color-primary-light)',
    },
    '.bg-primary-dark': {
      backgroundColor: 'var(--color-primary-dark)',
    },
    '.bg-background': {
      backgroundColor: 'var(--color-background)',
    },
    '.bg-background-light': {
      backgroundColor: 'var(--color-background-light)',
    },
    '.text-primary': {
      color: 'var(--color-primary)',
    },
    '.text-primary-dark': {
      color: 'var(--color-primary-dark)',
    },
    '.text-text': {
      color: 'var(--color-text)',
    },
    '.text-text-muted': {
      color: 'var(--color-text-muted)',
    },
    '.border-primary': {
      borderColor: 'var(--color-primary)',
    },
    '.border-border': {
      borderColor: 'var(--color-border)',
    },
  }
  addUtilities(newUtilities, ['responsive', 'hover'])
})
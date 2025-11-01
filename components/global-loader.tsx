// components/global-loader.tsx
"use client"

import { useLoading } from '@/contexts/loading-context'
import { LoadingSpinner } from './loading-spinner'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function GlobalLoader() {
  const { isLoading, setLoading } = useLoading()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)

  // Handle route changes
  useEffect(() => {
    const handleStart = () => {
      setIsNavigating(true)
      setLoading(true)
    }

    const handleComplete = () => {
      setIsNavigating(false)
      // Add a small delay for smoother transition
      setTimeout(() => setLoading(false), 500)
    }

    handleComplete()
  }, [pathname, searchParams, setLoading])

  // Initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000) // Simulate initial loading time

    return () => clearTimeout(timer)
  }, [setLoading])

  if (!isLoading && !isNavigating) return null

  return <LoadingSpinner />
}
"use client"

import { redirect } from 'next/navigation'
import WorkerOnboardingClient from './WorkerOnboardingClient'
import { fetchOnboardingProgress } from '@/lib/onboarding-service'
import { useEffect, useState } from "react"
import { WorkerProfile } from '@/lib/mock-data'
import { useRouter } from "next/navigation"

export default function WorkerOnboardingPage() {
  const router = useRouter()
  const [user, setUser] = useState<WorkerProfile | null>(null)
  const [progressData, setProgressData] = useState<any>(null)
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)
  const [loading, setLoading] = useState(true)

  const calculateProfileCompletion = (user: WorkerProfile) => {
    return Math.round(
      ((user.documents.passport ? 1 : 0) +
        (user.documents.certificate ? 1 : 0) +
        (user.documents.medicalReport ? 1 : 0) +
        (user.subscriptions.insurance ? 1 : 0) +
        (user.subscriptions.legal ? 1 : 0) +
        (user.subscriptions.medical ? 1 : 0)) *
        (100 / 6),
    )
  }

  useEffect(() => {
    const initializeOnboarding = async () => {
      const userData = sessionStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "worker") {
        router.push("/login")
        return
      }

      setUser(parsedUser)
      
      // Show profile prompt if profile completion is low
      const completion = calculateProfileCompletion(parsedUser)
      if (completion < 70) {
        setShowProfilePrompt(true)
      }
      
      // Fetch progress data after setting user
      try {
        const progress = await fetchOnboardingProgress(parsedUser.id)
        setProgressData(progress)
      } catch (error) {
        console.error("Failed to fetch onboarding progress:", error)
      }
      
      setLoading(false)
    }

    initializeOnboarding()
  }, [router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // or redirect handled by useEffect
  }

  return (
    <WorkerOnboardingClient 
      initialUser={user}
      initialProgress={progressData}
    />
  )
}
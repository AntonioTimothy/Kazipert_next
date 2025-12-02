"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function EmployerJobsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/portals/employer/jobs')
  }, [router])

  return null
}
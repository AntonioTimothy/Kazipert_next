"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Briefcase, User, IdCard, Sparkles } from "lucide-react"

interface Step8SummaryProps {
  data: any
  user: any
  router: any
}

export default function Step8Summary({ data, user, router }: Step8SummaryProps) {
  const [showCelebration, setShowCelebration] = useState(true)
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }

    // Show toast on mount
    toast.success("🎉 Congratulations, your onboarding is complete!", {
      description: "You’re officially verified and ready to explore job opportunities.",
      duration: 6000,
      style: {
        background: "#0EA5E9",
        color: "white",
        fontWeight: 500,
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
      },
      icon: "🌍",
    })

    // Keep animation running for 10 seconds
    const timer = setTimeout(() => setShowCelebration(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative space-y-6">
      {/* 🎊 Dramatic Confetti + Glow Animation */}
      <AnimatePresence>
        {showCelebration && (
          <>
            <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={600} recycle={false} />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0.9, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 10, ease: "easeInOut" }}
              className="fixed inset-0 z-40 bg-gradient-to-br from-theme-primary/40 via-blue-500/30 to-theme-success/40 blur-3xl animate-pulse"
            />
            <motion.div
              className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 10, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ✅ Summary Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="rounded-lg border-2 p-4 border-theme-success/30 bg-theme-success/5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-theme-success mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-success mb-1 text-lg">Application Complete! 🎉</h3>
            <p className="text-theme-text-muted text-sm">
              Your profile is now ready for verification. Here's a summary of your application.
            </p>
          </div>
        </div>
      </motion.div>

      {/* 🧾 Summary Details */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Personal Information */}
        <Card className="bg-theme-background border-theme-border hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
              <User className="h-4 w-4 text-theme-primary" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Full Name:</span>
              <span className="font-medium text-theme-text">{user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Date of Birth:</span>
              <span className="font-medium text-theme-text">{data.personalInfo.dateOfBirth || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">County:</span>
              <span className="font-medium text-theme-text">{data.personalInfo.county || "Not selected"}</span>
            </div>
          </CardContent>
        </Card>

        {/* KYC Details */}
        <Card className="bg-theme-background border-theme-border hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
              <IdCard className="h-4 w-4 text-theme-primary" />
              KYC Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-theme-text-muted">ID Number:</span>
              <span className="font-medium text-theme-text">{data.kycDetails.idNumber || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Work Experience:</span>
              <span className="font-medium text-theme-text">{data.kycDetails.workExperience || "Not specified"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-theme-text-muted">Skills:</span>
              <span className="font-medium text-theme-text">{data.kycDetails.skills?.length || 0} selected</span>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status */}
        <Card className="bg-theme-background border-theme-border hover:shadow-lg transition">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-theme-text">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text">Face Verification</span>
              <Badge variant={data.verification.faceVerified ? "default" : "secondary"}>
                {data.verification.faceVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text">Documents</span>
              <Badge
                variant={
                  data.documents.profilePicture && data.documents.idDocumentFront && data.documents.idDocumentBack
                    ? "default"
                    : "secondary"
                }
              >
                {data.documents.profilePicture && data.documents.idDocumentFront && data.documents.idDocumentBack
                  ? "Uploaded"
                  : "Incomplete"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-theme-text">Payment Status</span>
              <Badge variant={data.verification.paymentVerified ? "default" : "secondary"}>
                {data.verification.paymentVerified ? "Paid" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 🚀 Next Steps */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
        <Card className="bg-theme-background border-theme-border">
          <CardHeader>
            <CardTitle className="text-sm text-theme-text">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              {[
                ["Document Verification", "Our team will verify your documents within 24-48 hours."],
                ["Profile Activation", "Once verified, your profile will be activated for job matching."],
                ["Job Matching", "We'll connect you with suitable international employers."],
              ].map(([title, desc], idx) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-theme-primary">{idx + 1}</span>
                  </div>
                  <div>
                    <span className="font-medium text-theme-text">{title}</span>
                    <p className="text-theme-text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 🌟 Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="flex gap-3"
      >
        <Button
          onClick={() => router.push("/worker/jobs")}
          className="flex-1 text-white font-semibold text-base py-2.5 bg-theme-primary shadow-md hover:shadow-lg transition"
        >
          <Briefcase className="h-5 w-5 mr-2" />
          Browse Available Jobs
        </Button>
        <Button
          onClick={() => router.push("/worker/dashboard")}
          variant="outline"
          className="border-theme-border hover:bg-theme-primary/10"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  )
}

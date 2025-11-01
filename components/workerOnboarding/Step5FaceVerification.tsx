"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, User, IdCard, Loader2, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface Step5FaceVerificationProps {
  data: any
  updateData: (section: string, updates: any) => void
  onFaceVerification: () => Promise<void>
  saving: boolean
}

export default function Step5FaceVerification({ data, updateData, onFaceVerification, saving }: Step5FaceVerificationProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <Camera className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-1">Face Verification</h3>
            <p className="text-theme-text-muted text-sm">
              We'll compare your profile picture with your ID photo to verify your identity.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Picture */}
        <Card className="bg-theme-background border-theme-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
              <User className="h-4 w-4 text-theme-primary" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.documents.profilePicture ? (
              <div className="aspect-square rounded-lg border-2 border-theme-primary/30 overflow-hidden">
                <img
                  src={data.documents.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square rounded-lg border-2 border-dashed border-theme-border flex items-center justify-center">
                <p className="text-theme-text-muted text-sm">No profile picture</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ID Photo */}
        <Card className="bg-theme-background border-theme-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
              <IdCard className="h-4 w-4 text-theme-primary" />
              ID Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.documents.idDocumentFront ? (
              <div className="aspect-[4/3] rounded-lg border-2 border-theme-primary/30 overflow-hidden">
                <img
                  src={data.documents.idDocumentFront}
                  alt="ID"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-theme-border flex items-center justify-center">
                <p className="text-theme-text-muted text-sm">No ID document</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border-2 p-6 text-center border-theme-primary/30 bg-theme-primary/5">
        {data.verification.faceVerified ? (
          <div className="space-y-4">
            <div className="h-16 w-16 rounded-full bg-theme-success/20 border-2 border-theme-success flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-theme-success" />
            </div>
            <p className="text-lg font-semibold text-theme-success">Face Verification Successful!</p>
            <p className="text-sm text-theme-text-muted">Your identity has been verified with 95% match confidence.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center space-x-2 mb-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-theme-primary rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            <p className="text-lg font-semibold text-theme-text">Ready for Face Verification</p>
            <p className="text-sm text-theme-text-muted mb-4">
              Click the button below to start the facial recognition process.
            </p>

            <Button
              onClick={onFaceVerification}
              disabled={saving || !data.documents.profilePicture || !data.documents.idDocumentFront}
              className="text-white bg-theme-primary"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Start Face Verification
                </>
              )}
            </Button>

            {(!data.documents.profilePicture || !data.documents.idDocumentFront) && (
              <p className="text-sm text-theme-error mt-2">
                Please upload both profile picture and ID document first.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
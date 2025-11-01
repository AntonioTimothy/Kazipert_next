"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, CheckCircle } from "lucide-react"

interface Step1InstructionsProps {
  data: any
  updateData: (section: string, updates: any) => void
}

export default function Step1Instructions({ data, updateData }: Step1InstructionsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-2">Important Instructions</h3>
            <p className="text-theme-text-muted text-sm">
              Please read the following instructions carefully before proceeding with your onboarding.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-theme-background border-theme-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                <CheckCircle className="h-4 w-4 text-theme-success" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-theme-text-muted">
                <li>• National ID Card (Front & Back)</li>
                <li>• Profile Photo</li>
                <li>• Medical Certificate</li>
                <li>• Passport (Optional)</li>
                <li>• KRA PIN Certificate (Optional)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-theme-background border-theme-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
                <CheckCircle className="h-4 w-4 text-theme-success" />
                Process Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-theme-text-muted">
                <li>• Complete all steps: 15-20 minutes</li>
                <li>• Document verification: 24-48 hours</li>
                <li>• Medical check: 1-2 days</li>
                <li>• Job matching: Within 1 week</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-theme-primary/30 bg-theme-primary/5">
          <CardHeader>
            <CardTitle className="text-sm text-theme-text">Attestation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accuracy"
                checked={data.terms.accuracy}
                onCheckedChange={(checked) =>
                  updateData('terms', { accuracy: checked as boolean })
                }
              />
              <label htmlFor="accuracy" className="text-sm cursor-pointer text-theme-text">
                I attest that all information provided is accurate and truthful to the best of my knowledge.
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={data.terms.terms}
                onCheckedChange={(checked) =>
                  updateData('terms', { terms: checked as boolean })
                }
              />
              <label htmlFor="terms" className="text-sm cursor-pointer text-theme-text">
                I agree to the <a href="/terms" className="text-theme-primary hover:underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-theme-primary hover:underline">Privacy Policy</a>.
              </label>
            </div>
            <div className="flex items-start space-x-3">
              <Checkbox
                id="consent"
                checked={data.terms.consent}
                onCheckedChange={(checked) =>
                  updateData('terms', { consent: checked as boolean })
                }
              />
              <label htmlFor="consent" className="text-sm cursor-pointer text-theme-text">
                I consent to the verification of my documents and background checks as required for employment in Oman.
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
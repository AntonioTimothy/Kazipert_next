"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CreditCard, Shield, CheckCircle, Smartphone, Receipt, Loader2 } from "lucide-react"

interface Step7PaymentProps {
  data: any
  updateData: (section: string, updates: any) => void
  onProcessPayment: () => Promise<void>
  saving: boolean
}

export default function Step7Payment({ data, updateData, onProcessPayment, saving }: Step7PaymentProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-1">Registration Payment</h3>
            <p className="text-theme-text-muted text-sm">
              Complete your registration with our one-time payment. This unlocks full access to international job opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Trust Building Section */}
      <Card className="bg-theme-background border-theme-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
            <Shield className="h-4 w-4 text-theme-success" />
            Why Verify with Kazipert?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-theme-text">Access International Jobs</span>
                <p className="text-theme-text-muted">Connect with employers in Oman, UAE, Qatar and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-theme-text">Verified Profile Badge</span>
                <p className="text-theme-text-muted">Stand out to employers with verified credentials</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-theme-text">Priority Job Matching</span>
                <p className="text-theme-text-muted">Get matched with the best opportunities first</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-4 w-4 text-theme-success mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium text-theme-text">Dedicated Support</span>
                <p className="text-theme-text-muted">24/7 support throughout your employment journey</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-theme-background border-theme-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2 text-theme-text">
            <Receipt className="h-4 w-4 text-theme-text-muted" />
            Invoice Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-theme-border">
            <span className="text-sm text-theme-text">Registration Fee</span>
            <span className="font-semibold text-theme-text">KES 200</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-theme-border">
            <span className="text-sm text-theme-text">Verification Services</span>
            <span className="text-theme-success">KES 0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-theme-border">
            <span className="text-sm text-theme-text">Photo Studio Session</span>
            <span className="text-theme-success">KES 0</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-semibold text-theme-text">Total Amount</span>
            <span className="font-bold text-lg text-theme-text">KES 200</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-theme-text">
            MPesa Payment
          </Label>
          <div className="space-y-2">
            <Label htmlFor="mpesaNumber" className="text-sm text-theme-text">
              MPesa Phone Number *
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="mpesaNumber"
                  type="tel"
                  placeholder="07XX XXX XXX"
                  className="h-10 border-theme-border focus:border-theme-primary text-base"
                  value={data.payment.mpesaNumber}
                  onChange={(e) => updateData('payment', { mpesaNumber: e.target.value })}
                  disabled={data.payment.payLater}
                />
              </div>
              <Button
                onClick={onProcessPayment}
                disabled={saving || !data.payment.mpesaNumber || data.payment.payLater}
                className="h-10 px-6 text-white text-base bg-theme-primary"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-theme-text-muted">
              You will receive an STK push on your phone to complete the payment of KES 200.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3 rounded-lg border-2 p-4 border-theme-border">
          <Checkbox
            id="payLater"
            checked={data.payment.payLater}
            onCheckedChange={(checked) => {
              updateData('payment', {
                payLater: checked as boolean,
                mpesaNumber: checked ? "" : data.payment.mpesaNumber
              })
            }}
          />
          <label htmlFor="payLater" className="text-sm cursor-pointer text-theme-text flex-1">
            <span className="font-medium">I will pay later</span>
            <p className="text-theme-text-muted mt-1">
              I understand that I need to complete this payment before I can be matched with international employers.
              I can continue browsing local opportunities in the meantime.
            </p>
          </label>
        </div>

        {data.verification.paymentVerified && (
          <div className="rounded-lg border-2 border-theme-success/20 bg-theme-success/10 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-theme-success" />
              <span className="font-semibold text-theme-success">Payment Successful!</span>
            </div>
            <p className="text-sm text-theme-text-muted mt-1">
              Your registration fee has been processed successfully. You now have full access to international job opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
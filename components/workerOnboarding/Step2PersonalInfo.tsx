"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, MapPin } from "lucide-react"
import { useEffect } from "react"

interface Step2PersonalInfoProps {
  data: any
  updateData: (section: string, updates: any) => void
  user: any
  onCountyModalOpen: () => void
}

export default function Step2PersonalInfo({ data, updateData, user, onCountyModalOpen }: Step2PersonalInfoProps) {

  useEffect(() => {
    // Prefill personal info if available
    console.log('User data:', user);
  }
  ), []


  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <User className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-1">Personal Information</h3>
            <p className="text-theme-text-muted text-sm">
              Your basic information has been prefilled from your account. Please complete the remaining fields.
            </p>
          </div>
        </div>
      </div>

      {/* Prefilled User Info */}
      <Card className="bg-theme-background border-theme-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-theme-text">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-theme-text-muted">Full Name:</span>
              <p className="font-medium text-theme-text">{user.name}</p>
            </div>
            <div>
              <span className="text-theme-text-muted">Email:</span>
              <p className="font-medium text-theme-text">{user.email}</p>
            </div>
            <div>
              <span className="text-theme-text-muted">Phone:</span>
              <p className="font-medium text-theme-text">{user.phone}</p>
            </div>
            <div>
              <span className="text-theme-text-muted">Gender:</span>
              <p className="font-medium text-theme-text capitalize">{user.gender}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editable Fields */}
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
  <Label htmlFor="dateOfBirth" className="text-sm font-semibold text-theme-text">
    Date of Birth *
  </Label>
  <Input
    id="dateOfBirth"
    type="date"
    className="h-9 border-theme-border focus:border-theme-primary"
    value={data.personalInfo.dateOfBirth}
    onChange={(e) => updateData('personalInfo', { dateOfBirth: e.target.value })}
    onFocus={(e) => {
      if (!e.target.value) {
        e.target.value = '2000-01-01';
        setTimeout(() => e.target.showPicker(), 0);
      }
    }}
    onBlur={(e) => {
      if (e.target.value === '2000-01-01' && !data.personalInfo.dateOfBirth) {
        e.target.value = '';
      }
    }}
  />
</div>
          <div className="space-y-2">
            <Label htmlFor="county" className="text-sm font-semibold text-theme-text">
              County of Residence *
            </Label>
            <div className="relative">
              <Input
                id="county"
                placeholder="Select your county"
                className="h-9 border-theme-border focus:border-theme-primary cursor-pointer"
                value={data.personalInfo.county}
                readOnly
                onClick={onCountyModalOpen}
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-theme-text-muted" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="physicalAddress" className="text-sm font-semibold text-theme-text">
            Home Address *
          </Label>
          <Textarea
            id="physicalAddress"
            placeholder="Enter your full physical address"
            rows={3}
            className="border-theme-border focus:border-theme-primary"
            value={data.personalInfo.physicalAddress}
            onChange={(e) => updateData('personalInfo', { physicalAddress: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IdCard, Plus, Minus, X } from "lucide-react"

interface Step3KycDetailsProps {
  data: any
  updateData: (section: string, updates: any) => void
  onCountriesModalOpen: () => void
}

export default function Step3KycDetails({ data, updateData, onCountriesModalOpen }: Step3KycDetailsProps) {
  const skillsList = [
    "House Cleaning", "Cooking", "Childcare", "Elderly Care",
    "Laundry & Ironing", "Pet Care", "Gardening", "Driving",
    "First Aid", "Swimming", "Tutoring", "House Management"
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 p-4 border-theme-primary/30 bg-theme-primary/5">
        <div className="flex items-start gap-3">
          <IdCard className="h-5 w-5 text-theme-primary mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-theme-text mb-1">KYC Verification</h3>
            <p className="text-theme-text-muted text-sm">
              Provide your identity information. Passport and KRA PIN are optional but recommended for better job matching.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="idNumber" className="text-sm font-semibold text-theme-text">
              National ID Number *
            </Label>
            <Input
              id="idNumber"
              placeholder="Enter your ID number"
              className="h-9 border-theme-border focus:border-theme-primary"
              value={data.kycDetails.idNumber}
              onChange={(e) => updateData('kycDetails', { idNumber: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passportNumber" className="text-sm font-semibold text-theme-text">
              Passport Number <span className="text-theme-text-muted font-normal">(Optional)</span>
            </Label>
            <Input
              id="passportNumber"
              placeholder="Enter passport number"
              className="h-9 border-theme-border focus:border-theme-primary"
              value={data.kycDetails.passportNumber}
              onChange={(e) => updateData('kycDetails', { passportNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kraPin" className="text-sm font-semibold text-theme-text">
              KRA PIN <span className="text-theme-text-muted font-normal">(Optional)</span>
            </Label>
            <Input
              id="kraPin"
              placeholder="Enter KRA PIN"
              className="h-9 border-theme-border focus:border-theme-primary"
              value={data.kycDetails.kraPin}
              onChange={(e) => updateData('kycDetails', { kraPin: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maritalStatus" className="text-sm font-semibold text-theme-text">
              Marital Status *
            </Label>
            <Select
              value={data.kycDetails.maritalStatus}
              onValueChange={(value) => updateData('kycDetails', { maritalStatus: value })}
            >
              <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Children Information */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-theme-text">
              Do you have children? *
            </Label>
            <Select
              value={data.kycDetails.hasChildren}
              onValueChange={(value) => updateData('kycDetails', {
                hasChildren: value,
                numberOfChildren: value === "no" ? 0 : data.kycDetails.numberOfChildren
              })}
            >
              <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.kycDetails.hasChildren === "yes" && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-theme-text">
                Number of Children *
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-theme-border"
                  onClick={() => updateData('kycDetails', {
                    numberOfChildren: Math.max(0, data.kycDetails.numberOfChildren - 1)
                  })}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="0"
                  className="h-9 text-center border-theme-border"
                  value={data.kycDetails.numberOfChildren}
                  onChange={(e) => updateData('kycDetails', {
                    numberOfChildren: parseInt(e.target.value) || 0
                  })}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-theme-border"
                  onClick={() => updateData('kycDetails', {
                    numberOfChildren: data.kycDetails.numberOfChildren + 1
                  })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* International Work Experience */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-theme-text">
            Have you worked outside Kenya before? *
          </Label>
          <Select
            value={data.kycDetails.workedAbroad}
            onValueChange={(value) => updateData('kycDetails', {
              workedAbroad: value,
              countriesWorked: value === "no" ? [] : data.kycDetails.countriesWorked
            })}
          >
            <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          {data.kycDetails.workedAbroad === "yes" && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-theme-text">
                Select countries where you have worked *
              </Label>
              <div className="flex flex-wrap gap-2">
                {data.kycDetails.countriesWorked.map((country: string) => (
                  <Badge key={country} variant="secondary" className="bg-theme-primary/10 text-theme-primary">
                    {country}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => updateData('kycDetails', {
                        countriesWorked: data.kycDetails.countriesWorked.filter((c: string) => c !== country)
                      })}
                    />
                  </Badge>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCountriesModalOpen}
                  className="border-theme-border hover:bg-theme-primary/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Countries
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-theme-text">Work Experience - As a Domestic worker *</Label>
          <Select
            value={data.kycDetails.workExperience}
            onValueChange={(value) => updateData('kycDetails', { workExperience: value })}
          >
            <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">My first time</SelectItem>
              <SelectItem value="0-1">Less than 1 year</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-7">5-7 years</SelectItem>
              <SelectItem value="7+">7+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-theme-text">Skills & Expertise *</Label>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-3">
            {skillsList.map((skill) => (
              <div
                key={skill}
                className="flex items-center space-x-2 rounded-lg border p-2 hover:bg-theme-primary/5 transition-colors border-theme-border"
              >
                <Checkbox
                  id={skill.toLowerCase().replace(/\s+/g, "-")}
                  checked={data.kycDetails.skills.includes(skill)}
                  onCheckedChange={(checked) => {
                    const skills = checked
                      ? [...data.kycDetails.skills, skill]
                      : data.kycDetails.skills.filter((s: string) => s !== skill)
                    updateData('kycDetails', { skills })
                  }}
                />
                <label
                  htmlFor={skill.toLowerCase().replace(/\s+/g, "-")}
                  className="text-sm cursor-pointer flex-1 text-theme-text"
                >
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-theme-text">Languages *</Label>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="english" className="text-xs text-theme-text">English Level</Label>
              <Select
                value={data.kycDetails.languages.english}
                onValueChange={(value) => updateData('kycDetails', {
                  languages: { ...data.kycDetails.languages, english: value }
                })}
              >
                <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="swahili" className="text-xs text-theme-text">Swahili Level</Label>
              <Select
                value={data.kycDetails.languages.swahili}
                onValueChange={(value) => updateData('kycDetails', {
                  languages: { ...data.kycDetails.languages, swahili: value }
                })}
              >
                <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="arabic" className="text-xs text-theme-text">Arabic Level</Label>
              <Select
                value={data.kycDetails.languages.arabic}
                onValueChange={(value) => updateData('kycDetails', {
                  languages: { ...data.kycDetails.languages, arabic: value }
                })}
              >
                <SelectTrigger className="h-9 border-theme-border focus:border-theme-primary">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
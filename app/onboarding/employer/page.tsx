"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Building, FileText, Users, Home, DollarSign, Shield, Calendar, Upload } from "lucide-react"

export default function EmployerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 8

  const steps = [
    { number: 1, title: "Company/Personal Info", icon: Building },
    { number: 2, title: "Contact Details", icon: FileText },
    { number: 3, title: "Household Information", icon: Home },
    { number: 4, title: "Job Requirements", icon: Users },
    { number: 5, title: "Compensation & Benefits", icon: DollarSign },
    { number: 6, title: "Documents Upload", icon: Upload },
    { number: 7, title: "Insurance Selection", icon: Shield },
    { number: 8, title: "Contract Preferences", icon: Calendar },
  ]

  const progress = (currentStep / totalSteps) * 100

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container max-w-5xl">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Employer Onboarding</h1>
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Steps Navigation */}
          <div className="mb-8 hidden lg:block">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((step) => {
                const StepIcon = step.icon
                return (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all ${
                      currentStep === step.number
                        ? "border-secondary bg-secondary/5"
                        : currentStep > step.number
                          ? "border-green-500 bg-green-50"
                          : "border-border bg-background"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        currentStep === step.number
                          ? "bg-secondary text-secondary-foreground"
                          : currentStep > step.number
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs font-medium">{step.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {(() => {
                  const StepIcon = steps[currentStep - 1].icon
                  return <StepIcon className="h-6 w-6 text-secondary" />
                })()}
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>Please provide accurate information to find the right worker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Company/Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual/Family</SelectItem>
                        <SelectItem value="company">Company/Organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Select defaultValue="omani">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="omani">Omani</SelectItem>
                        <SelectItem value="saudi">Saudi Arabian</SelectItem>
                        <SelectItem value="uae">UAE</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilId">Civil ID Number *</Label>
                    <Input id="civilId" placeholder="Enter your Civil ID number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation *</Label>
                    <Input id="occupation" placeholder="Your occupation" />
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" placeholder="+968 9000 0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input id="whatsapp" type="tel" placeholder="+968 9000 0000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="muscat">Muscat</SelectItem>
                        <SelectItem value="salalah">Salalah</SelectItem>
                        <SelectItem value="sohar">Sohar</SelectItem>
                        <SelectItem value="nizwa">Nizwa</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea id="address" placeholder="Enter your complete address" rows={3} />
                  </div>
                </div>
              )}

              {/* Step 3: Household Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="houseType">Type of Residence *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select residence type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="compound">Compound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Number of Bedrooms *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2</SelectItem>
                          <SelectItem value="3-4">3-4</SelectItem>
                          <SelectItem value="5+">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="floors">Number of Floors *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3+">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familySize">Family Size *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select family size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-2">1-2 members</SelectItem>
                        <SelectItem value="3-4">3-4 members</SelectItem>
                        <SelectItem value="5-6">5-6 members</SelectItem>
                        <SelectItem value="7+">7+ members</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Children in Household</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="infants" />
                        <label htmlFor="infants" className="text-sm">
                          Infants (0-2 years)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="toddlers" />
                        <label htmlFor="toddlers" className="text-sm">
                          Toddlers (3-5 years)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="school-age" />
                        <label htmlFor="school-age" className="text-sm">
                          School-age (6-12 years)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="teenagers" />
                        <label htmlFor="teenagers" className="text-sm">
                          Teenagers (13+ years)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Special Considerations</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="elderly" />
                        <label htmlFor="elderly" className="text-sm">
                          Elderly family members requiring care
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pets" />
                        <label htmlFor="pets" className="text-sm">
                          Pets in household
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="special-needs" />
                        <label htmlFor="special-needs" className="text-sm">
                          Family member with special needs
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Job Requirements */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Required Duties *</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cleaning" />
                        <label htmlFor="cleaning" className="text-sm">
                          House Cleaning
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="laundry" />
                        <label htmlFor="laundry" className="text-sm">
                          Laundry & Ironing
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="cooking" />
                        <label htmlFor="cooking" className="text-sm">
                          Cooking
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="childcare" />
                        <label htmlFor="childcare" className="text-sm">
                          Childcare
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="elderly-care" />
                        <label htmlFor="elderly-care" className="text-sm">
                          Elderly Care
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pet-care" />
                        <label htmlFor="pet-care" className="text-sm">
                          Pet Care
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Required Experience Level *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-1 year)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                        <SelectItem value="expert">Expert (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language Requirements *</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="english-req" defaultChecked />
                        <label htmlFor="english-req" className="text-sm">
                          English (Basic or better)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="arabic-req" />
                        <label htmlFor="arabic-req" className="text-sm">
                          Arabic (Preferred)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                    <Textarea
                      id="additionalRequirements"
                      placeholder="Describe any specific skills, certifications, or requirements..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Placeholder for remaining steps */}
              {currentStep > 4 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">
                    Step {currentStep} content will be displayed here. Continue to complete your onboarding.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                  Previous
                </Button>
                <Button onClick={nextStep} className="bg-secondary hover:bg-secondary/90">
                  {currentStep === totalSteps ? "Complete Onboarding" : "Next Step"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

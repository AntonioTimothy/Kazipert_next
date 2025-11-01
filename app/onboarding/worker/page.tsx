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
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  User,
  FileText,
  Upload,
  Camera,
  Shield,
  Heart,
  AlertCircle,
  Check,
  ArrowRight,
} from "lucide-react"

export default function WorkerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [faceVerified, setFaceVerified] = useState(false)
  const totalSteps = 6

  const steps = [
    { number: 1, title: "Basic Information", icon: User, description: "Personal details and contact" },
    { number: 2, title: "KYC & Identity", icon: FileText, description: "Identity verification" },
    { number: 3, title: "Document Upload", icon: Upload, description: "Certificates and documents" },
    { number: 4, title: "Studio Verification", icon: Camera, description: "Professional photos & face recognition" },
    { number: 5, title: "Subscriptions", icon: Shield, description: "Insurance, legal, medical" },
    { number: 6, title: "Review & Submit", icon: Heart, description: "Final review" },
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

  const simulateFaceRecognition = () => {
    // Simulate face recognition process
    setTimeout(() => {
      setFaceVerified(true)
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* <SiteHeader /> */}
      <main className="flex-1 bg-muted/30 py-8">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  Worker Onboarding
                  <span className="h-1.5 w-12 bg-accent rounded-full" />
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Complete all steps to activate your profile</p>
              </div>
              <Badge variant="outline" className="border-accent/40 bg-accent/10 text-accent-foreground px-4 py-2">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
          </div>

          <div className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {steps.map((step) => {
                const StepIcon = step.icon
                const isActive = currentStep === step.number
                const isCompleted = currentStep > step.number

                return (
                  <button
                    key={step.number}
                    onClick={() => setCurrentStep(step.number)}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all ${
                      isActive
                        ? "border-accent bg-accent/10 shadow-lg shadow-accent/20"
                        : isCompleted
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-accent/30"
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? "bg-accent text-accent-foreground shadow-lg"
                          : isCompleted
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{step.title}</div>
                      <div className="text-xs text-muted-foreground hidden md:block">{step.description}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-2">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const StepIcon = steps[currentStep - 1].icon
                    return (
                      <div className="h-14 w-14 rounded-xl bg-accent/20 border-2 border-accent/40 flex items-center justify-center">
                        <StepIcon className="h-7 w-7 text-accent-foreground" />
                      </div>
                    )
                  })()}
                  <div>
                    <CardTitle className="text-2xl">{steps[currentStep - 1].title}</CardTitle>
                    <CardDescription className="text-base">{steps[currentStep - 1].description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-base font-semibold">
                        First Name *
                      </Label>
                      <Input id="firstName" placeholder="Enter your first name" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-base font-semibold">
                        Last Name *
                      </Label>
                      <Input id="lastName" placeholder="Enter your last name" className="h-11" />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-base font-semibold">
                        Date of Birth *
                      </Label>
                      <Input id="dob" type="date" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-base font-semibold">
                        Gender *
                      </Label>
                      <Select>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-base font-semibold">
                        Phone Number *
                      </Label>
                      <Input id="phone" type="tel" placeholder="+254 700 000 000" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-base font-semibold">
                        Email Address *
                      </Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" className="h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="county" className="text-base font-semibold">
                      County of Residence *
                    </Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select your county" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nairobi">Nairobi</SelectItem>
                        <SelectItem value="mombasa">Mombasa</SelectItem>
                        <SelectItem value="kisumu">Kisumu</SelectItem>
                        <SelectItem value="nakuru">Nakuru</SelectItem>
                        <SelectItem value="eldoret">Eldoret</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base font-semibold">
                      Physical Address *
                    </Label>
                    <Textarea id="address" placeholder="Enter your full address" rows={3} />
                  </div>

                  <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <span className="h-1 w-6 bg-accent rounded-full" />
                      Emergency Contact
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Contact Name *</Label>
                        <Input id="emergencyName" placeholder="Full name" className="h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                        <Input id="emergencyPhone" type="tel" placeholder="+254 700 000 000" className="h-11" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: KYC & Identity */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">KYC Verification Required</p>
                        <p className="text-muted-foreground">
                          All information must match your official documents. This helps protect you and ensures
                          compliance with labor laws.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="idNumber" className="text-base font-semibold">
                        National ID Number *
                      </Label>
                      <Input id="idNumber" placeholder="Enter your ID number" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber" className="text-base font-semibold">
                        Passport Number *
                      </Label>
                      <Input id="passportNumber" placeholder="Enter passport number" className="h-11" />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="passportIssue" className="text-base font-semibold">
                        Passport Issue Date *
                      </Label>
                      <Input id="passportIssue" type="date" className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportExpiry" className="text-base font-semibold">
                        Passport Expiry Date *
                      </Label>
                      <Input id="passportExpiry" type="date" className="h-11" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus" className="text-base font-semibold">
                      Marital Status *
                    </Label>
                    <Select>
                      <SelectTrigger className="h-11">
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

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Work Experience *</Label>
                    <Select>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-7">5-7 years</SelectItem>
                        <SelectItem value="7+">7+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Skills & Expertise *</Label>
                    <div className="grid gap-3 md:grid-cols-2">
                      {["House Cleaning", "Cooking", "Childcare", "Elderly Care", "Laundry & Ironing", "Pet Care"].map(
                        (skill) => (
                          <div
                            key={skill}
                            className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                          >
                            <Checkbox id={skill.toLowerCase().replace(/\s+/g, "-")} />
                            <label
                              htmlFor={skill.toLowerCase().replace(/\s+/g, "-")}
                              className="text-sm font-medium cursor-pointer flex-1"
                            >
                              {skill}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Languages *</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="english">English Level</Label>
                        <Select defaultValue="intermediate">
                          <SelectTrigger>
                            <SelectValue />
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
                        <Label htmlFor="arabic">Arabic Level</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="fluent">Fluent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-start gap-3">
                      <Upload className="h-5 w-5 text-accent-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Document Requirements</p>
                        <p className="text-muted-foreground">
                          Upload clear, high-quality scans or photos of your documents. All documents will be verified
                          by our team.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Document upload fields */}
                  {[
                    { id: "idCard", label: "National ID Card", required: true },
                    { id: "passport", label: "Passport Bio Page", required: true },
                    { id: "certificate", label: "Education Certificate", required: false },
                    { id: "workCert", label: "Work Experience Certificate", required: false },
                    { id: "goodConduct", label: "Certificate of Good Conduct", required: true },
                  ].map((doc) => (
                    <div key={doc.id} className="space-y-2">
                      <Label htmlFor={doc.id} className="text-base font-semibold">
                        {doc.label} {doc.required && "*"}
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input id={doc.id} type="file" accept="image/*,.pdf" className="h-11" />
                        <Badge variant="outline" className="whitespace-nowrap">
                          {doc.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 mt-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      Document Checklist
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Documents must be clear and readable
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Passport must be valid for at least 6 months
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        All names must match across documents
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        File size should not exceed 5MB per document
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-start gap-3">
                      <Camera className="h-5 w-5 text-accent-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Professional Photo & Face Verification</p>
                        <p className="text-muted-foreground">
                          Visit a certified studio photographer to take professional photos. Face recognition will
                          verify your identity against your ID.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Find Certified Studio Photographers</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      {[
                        { name: "PhotoPro Studio", location: "Nairobi CBD", distance: "2.5 km", rating: "4.8" },
                        { name: "Perfect Shots", location: "Westlands", distance: "5.1 km", rating: "4.9" },
                        { name: "Studio Excellence", location: "Kilimani", distance: "3.8 km", rating: "4.7" },
                        { name: "Elite Photography", location: "Parklands", distance: "4.2 km", rating: "4.8" },
                      ].map((studio) => (
                        <div
                          key={studio.name}
                          className="rounded-lg border-2 border-border p-4 hover:border-accent/40 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{studio.name}</h4>
                              <p className="text-sm text-muted-foreground">{studio.location}</p>
                            </div>
                            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                              ⭐ {studio.rating}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-sm text-muted-foreground">{studio.distance} away</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-accent/40 hover:bg-accent/10 bg-transparent"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <span className="h-1 w-6 bg-accent rounded-full" />
                      Face Recognition Verification
                    </h3>

                    {!faceVerified ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          After your studio session, the photographer will upload your photos. Our system will
                          automatically verify your face against your ID photo.
                        </p>
                        <div className="flex items-center justify-center p-8 border-2 border-dashed border-border rounded-lg bg-background">
                          <div className="text-center">
                            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-sm font-medium mb-2">Waiting for Studio Photos</p>
                            <p className="text-xs text-muted-foreground mb-4">
                              Photos will be uploaded by your photographer
                            </p>
                            <Button onClick={simulateFaceRecognition} variant="outline" size="sm">
                              Simulate Upload (Demo)
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center p-8 border-2 border-primary rounded-lg bg-primary/5">
                          <div className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-3">
                            <Check className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-lg font-semibold text-primary mb-2">Face Verification Successful!</p>
                          <p className="text-sm text-muted-foreground">
                            Your identity has been verified. Your photos match your ID.
                          </p>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="aspect-square rounded-lg border-2 border-accent/40 overflow-hidden">
                            <img
                              src="/african-woman-professional.jpg"
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="aspect-square rounded-lg border-2 border-accent/40 overflow-hidden">
                            <img
                              src="/african-woman-smiling.jpg"
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="aspect-square rounded-lg border-2 border-accent/40 overflow-hidden">
                            <img
                              src="/african-woman-professional-attire.jpg"
                              alt="Profile"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <h4 className="font-semibold mb-2">Photo Requirements:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Professional attire
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Clear face visibility (no sunglasses or hats)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Neutral background
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        High resolution (minimum 1200x1600 pixels)
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-accent-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Protect Yourself with Our Services</p>
                        <p className="text-muted-foreground">
                          Subscribe to essential services that protect your rights and wellbeing while working abroad.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Insurance */}
                    <div className="rounded-xl border-2 border-primary/30 p-6 hover:border-primary transition-colors">
                      <div className="h-12 w-12 rounded-lg bg-primary/20 border-2 border-primary/40 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Insurance Cover</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive health and travel insurance coverage
                      </p>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-primary">
                          $30<span className="text-sm font-normal text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Health coverage
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Emergency repatriation
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Accident protection
                        </li>
                      </ul>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="insurance" defaultChecked />
                        <label htmlFor="insurance" className="text-sm font-medium cursor-pointer">
                          Subscribe to Insurance
                        </label>
                      </div>
                    </div>

                    {/* Legal Services */}
                    <div className="rounded-xl border-2 border-secondary/30 p-6 hover:border-secondary transition-colors">
                      <div className="h-12 w-12 rounded-lg bg-secondary/20 border-2 border-secondary/40 flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Legal Service</h3>
                      <p className="text-sm text-muted-foreground mb-4">Expert legal consultation and representation</p>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-secondary">
                          $25<span className="text-sm font-normal text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-secondary" />
                          Contract review
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-secondary" />
                          Legal consultation
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-secondary" />
                          Dispute resolution
                        </li>
                      </ul>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="legal" defaultChecked />
                        <label htmlFor="legal" className="text-sm font-medium cursor-pointer">
                          Subscribe to Legal
                        </label>
                      </div>
                    </div>

                    {/* Medical Cover */}
                    <div className="rounded-xl border-2 border-accent/30 p-6 hover:border-accent transition-colors">
                      <div className="h-12 w-12 rounded-lg bg-accent/20 border-2 border-accent/40 flex items-center justify-center mb-4">
                        <Heart className="h-6 w-6 text-accent-foreground" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Medical Cover</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Medical examinations and health certifications
                      </p>
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-accent-foreground">
                          $20<span className="text-sm font-normal text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <ul className="space-y-2 text-sm mb-4">
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-accent-foreground" />
                          Medical exams
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-accent-foreground" />
                          Health certificates
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-accent-foreground" />
                          Mental wellness
                        </li>
                      </ul>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="medical" />
                        <label htmlFor="medical" className="text-sm font-medium cursor-pointer">
                          Subscribe to Medical
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">Total Monthly Subscription</p>
                        <p className="text-sm text-muted-foreground">Based on selected services</p>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        $75<span className="text-lg font-normal text-muted-foreground">/mo</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Submit */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-accent-foreground mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Review Your Information</p>
                        <p className="text-muted-foreground">
                          Please review all information before submitting. Your profile will be reviewed by our team
                          within 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Summary cards */}
                    <div className="rounded-lg border-2 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="h-1 w-6 bg-accent rounded-full" />
                          Personal Information
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                          Edit
                        </Button>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Name:</span>
                          <span className="font-medium">Amina Hassan</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Email:</span>
                          <span className="font-medium">amina.hassan@email.com</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Phone:</span>
                          <span className="font-medium">+254 712 345 678</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="h-1 w-6 bg-accent rounded-full" />
                          KYC & Documents
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                          Edit
                        </Button>
                      </div>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">ID Verification:</span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Documents:</span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            <Check className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Face Recognition:</span>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            <Check className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border-2 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <span className="h-1 w-6 bg-accent rounded-full" />
                          Subscriptions
                        </h3>
                        <Button variant="ghost" size="sm" onClick={() => setCurrentStep(5)}>
                          Edit
                        </Button>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Insurance Cover:</span>
                          <span className="font-medium">$30/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Legal Service:</span>
                          <span className="font-medium">$25/month</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Medical Cover:</span>
                          <span className="font-medium">$20/month</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="font-semibold">Total:</span>
                          <span className="font-bold text-primary">$75/month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
                    <Checkbox id="terms" />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I confirm that all information provided is accurate and I agree to the{" "}
                      <a href="/terms" className="text-primary hover:underline font-medium">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-primary hover:underline font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Check className="mr-2 h-5 w-5" />
                    Submit for Review
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-2 bg-transparent"
                >
                  Previous Step
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStep === totalSteps}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {currentStep === totalSteps ? "Complete" : "Next Step"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

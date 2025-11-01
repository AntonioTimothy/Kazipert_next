"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  UserCheck,
  XCircle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Briefcase,
  Globe,
  Lock,
  Star,
  Workflow,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const slides = [
  {
    image: "/employee1.jpg",
    title: "Your Data Security is Our Priority",
    desc: "Bank-level encryption and global security standards protect your information. Trust Kazipert with your career journey.",
    icon: Shield,
    trustPoints: ["256-bit Encryption", "GDPR Compliant", "Secure Verification"]
  },
  {
    image: "/employee2.jpg",
    title: "Verified Global Opportunities",
    desc: "Every employer and employee is thoroughly verified. Build your career on a foundation of trust and authenticity.",
    icon: Briefcase,
    trustPoints: ["Background Verified", "Secure Payments", "24/7 Support"]
  },
  {
    image: "/employee3.jpg",
    title: "Trusted by Thousands Worldwide",
    desc: "Join a community that values security, transparency, and successful global connections you can rely on.",
    icon: UserCheck,
    trustPoints: ["10,000+ Users", "98% Success Rate", "Global Reach"]
  },
  {
    image: "/employee5.jpg",
    title: "Secure Borderless Employment",
    desc: "Your passport to global opportunities with the security and trust you deserve at every step.",
    icon: Globe,
    trustPoints: ["Secure Documents", "Verified Partners", "Safe Transactions"]
  },
];

function OtpInput({ onComplete }: { onComplete: (code: string) => void }) {
  const length = 4;
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    const combined = values.join("");
    if (combined.length === length && !values.includes("") && !hasCompleted) {
      setHasCompleted(true);
      onComplete(combined);
    }
  }, [values, onComplete, hasCompleted]);

  const handleChange = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;
    
    const next = [...values];
    next[i] = v.slice(-1);
    setValues(next);
    setHasCompleted(false); // Reset completion state when user makes changes
    
    if (v && i < length - 1) {
      const el = document.getElementById(`otp-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) {
      const el = document.getElementById(`otp-${i - 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {values.map((v, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          value={v}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-12 h-12 text-center rounded-lg border-2 border-gray-300 text-lg font-bold focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none bg-white transition-all duration-200"
        />
      ))}
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ["Role", "Profile", "Phone", "Email", "Password", "Verify"];
  const totalSteps = steps.length;
  
  return (
    <div className="relative mb-6">
      <div className="flex justify-between items-center">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center z-10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center border-2 font-medium text-xs transition-all duration-300 relative",
                i < step 
                  ? "bg-[#FFD700] border-[#FFD700] text-gray-900 shadow-md" 
                  : i === step
                  ? "border-[#FFD700] bg-white text-gray-700"
                  : "border-gray-300 bg-white text-gray-400"
              )}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors mt-1",
                i <= step ? "text-gray-800" : "text-gray-400"
              )}>
                {s}
              </span>
            </div>
            
            {i < totalSteps - 1 && (
              <div className={cn(
                "flex-1 h-1 mx-1 transition-all duration-500",
                i < step ? "bg-[#FFD700]" : "bg-gray-300"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [slide, setSlide] = useState(0);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<"email" | "phone" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState<"EMPLOYEE" | "EMPLOYER">("EMPLOYEE");
  const [form, setForm] = useState({
    fullName: "",
    gender: "male",
    phone: "",
    country: "Kenya",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 6000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const updateField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const digitsOnly = phone.replace(/[^0-9]/g, "");
    return digitsOnly.length >= 10;
  };

  const canNext = () => {
    if (step === 0) return !!role;
    if (step === 1) return form.fullName.trim().length >= 2 && ["male", "female"].includes(form.gender);
    if (step === 2) return validatePhone(form.phone);
    if (step === 3) return validateEmail(form.email);
    if (step === 4) return form.password.length >= 8 && form.password === form.confirmPassword;
    return true;
  };

  const goNext = async () => {
    if (!canNext()) {
      if (step === 2) return setError("Please enter a valid phone number");
      if (step === 3) return setError("Please enter a valid email address");
      if (step === 4) {
        if (form.password.length < 8) return setError("Password must be at least 8 characters");
        if (form.password !== form.confirmPassword) return setError("Passwords do not match");
        return setError("Please complete all required fields.");
      }
      return setError("Please complete all required fields.");
    }

    setError("");
                              
    if (step === 2) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/send-phone-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: form.phone }),
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to send verification code");
        }
        
        setPendingPhone(form.phone);
        setVerificationStep("phone");
        setSuccess("Verification code sent to your phone");
      } catch (err: any) {
        setError(err?.message || "Failed to send verification code");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (step === 3) {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/send-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email }),
        });
        
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || data.message || "Failed to send verification code");
        }
        
        setPendingEmail(form.email);
        setVerificationStep("email");
        setSuccess("Verification code sent to your email");
      } catch (err: any) {
        setError(err?.message || "Failed to send verification code");
      } finally {
        setLoading(false);
      }
      return;
    }

    setStep((s) => Math.min(s + 1, 5));
  };

  const goBack = () => {
    if (verificationStep) {
      setVerificationStep(null);
    } else {
      setStep((s) => Math.max(0, s - 1));
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (!verificationStep) return;
    
    setLoading(true);
    try {
      const endpoint = verificationStep === "email" 
        ? "/api/auth/verify-email-otp" 
        : "/api/auth/verify-phone-otp";
      
      const payload = verificationStep === "email"
        ? { email: form.email, otp: code }
        : { phone: form.phone, otp: code };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || "Invalid verification code");
      }
      
      setSuccess(`${verificationStep === "email" ? "Email" : "Phone"} verified successfully!`);
      setVerificationStep(null);
      setStep((s) => s + 1);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (!verificationStep) return;
    
    setLoading(true);
    try {
      const endpoint = verificationStep === "email" 
        ? "/api/auth/send-email-otp" 
        : "/api/auth/send-phone-otp";
      
      const payload = verificationStep === "email"
        ? { email: form.email }
        : { phone: form.phone };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to resend code");
      }
      
      setSuccess("Verification code resent successfully");
    } catch (err: any) {
      setError(err?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const submitSignup = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        email: form.email,
        password: form.password,
        phone: form.phone,
        fullName: form.fullName,
        gender: form.gender,
        role,
      };
      
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || json.message || "Signup failed");
      }
      
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1000);
    } catch (err: any) {
      setError(err?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const RoleCard = ({
    r,
    title,
    desc,
    icon,
  }: {
    r: "EMPLOYEE" | "EMPLOYER";
    title: string;
    desc: string;
    icon: React.ReactNode;
  }) => {
    const active = role === r;
    return (
      <motion.button
        onClick={() => setRole(r)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex-1 p-4 rounded-xl border-2 transition-all duration-300 text-left group relative overflow-hidden",
          active
            ? "bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-gray-900 shadow-lg border-transparent"
            : "bg-white border-gray-200 hover:border-[#FFD700] hover:shadow-md"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "p-2 rounded-lg transition-all duration-300 flex-shrink-0",
              active 
                ? "bg-gray-900/20" 
                : "bg-gray-100 text-gray-600 group-hover:bg-[#FFD700]/20 group-hover:text-gray-700"
            )}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={cn("text-sm font-semibold transition-colors", active ? "text-gray-900" : "text-gray-800")}>
              {title}
            </h4>
            <p className={cn("text-xs mt-1 leading-relaxed text-gray-500", active && "text-gray-700")}>
              {desc}
            </p>
          </div>
        </div>
        {active && (
          <div className="absolute top-2 right-2">
            <Star className="w-4 h-4 fill-current" />
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* LEFT SECTION - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image src={slides[slide].image} alt="bg" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#FFD700]/20 to-[#FFA500]/30" />
          </motion.div>
        </AnimatePresence>

        <div className="z-20 text-center px-8 max-w-lg">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex justify-center"
          >
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              {(() => {
                const IconComponent = slides[slide].icon;
                return <IconComponent className="w-7 h-7 text-[#FFD700]" />;
              })()}
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-white mb-4 leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {slides[slide].title}
          </motion.h1>
          
          <motion.p 
            className="text-white/90 leading-relaxed mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {slides[slide].desc}
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {slides[slide].trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                <span className="text-sm font-medium">{point}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === slide ? "bg-[#FFD700] scale-125" : "bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Main Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Image 
                  src="/logo.svg" 
                  width={160} 
                  height={160} 
                  alt="logo" 
                  className="drop-shadow"
                  priority
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#FFD700] rounded-full border-2 border-white shadow"></div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Create your secure account
                </p>
              </div>
            </div>

            <Stepper step={step} />
          </div>

          {/* Messages */}
          {error && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <XCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex items-center gap-2 text-sm"
            >
              <CheckCircle size={16} className="flex-shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {/* Verification Step */}
          {verificationStep && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-4"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-[#FFD700]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Verify {verificationStep === "email" ? "Email" : "Phone"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Code sent to{" "}
                  <strong className="text-gray-900 break-all">
                    {verificationStep === "email" ? form.email : form.phone}
                  </strong>
                </p>

                <OtpInput onComplete={handleVerifyOtp} />

                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={goBack}
                      className="flex-1 rounded-lg border-gray-300 hover:border-gray-400 text-sm"
                    >
                      <ArrowLeft size={14} className="mr-1" />
                      Back
                    </Button>
                    <Button
                      onClick={() => document.querySelector('input[id^="otp-"]')?.focus()}
                      className="flex-1 bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 font-medium rounded-lg text-sm"
                    >
                      Enter Code
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    onClick={resendOtp}
                    disabled={loading}
                    className="text-[#FFD700] hover:text-[#FFA500] font-medium text-xs"
                  >
                    Resend Code
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Form Steps */}
          {!verificationStep && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              {step === 0 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Choose Your Role</h2>
                    <p className="text-gray-600 text-sm mt-1">Select how you want to use Kazipert</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <RoleCard
                      r="EMPLOYEE"
                      title="Register as Domestic Worker"
                      desc="Find verified jobs opportunities abroad"
                      icon={<Workflow size={18} />}
                    />
                    <RoleCard
                      r="EMPLOYER"
                      title="Register as an Employer"
                      desc="Hire trained and verified domestic workers"
                      icon={<UserCheck size={18} />}
                    />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    <p className="text-gray-600 text-sm mt-1">Tell us about yourself</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</Label>
                    <Input
                      placeholder="Enter your full name"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className="h-11 rounded-lg border-gray-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Gender</Label>
                    <RadioGroup 
                      value={form.gender} 
                      onValueChange={(value) => updateField("gender", value)}
                      className="flex gap-4"
                    >
                      {["male", "female"].map((g) => (
                        <label key={g} className="flex items-center gap-2 text-sm cursor-pointer group">
                          <RadioGroupItem
                            value={g}
                            className="h-4 w-4 text-[#FFD700] border-2 border-gray-300 group-hover:border-[#FFD700] transition-colors"
                          />
                          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Phone Verification</h2>
                    <p className="text-gray-600 text-sm mt-1">We'll send a code to your phone</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</Label>
                    <PhoneInput
                      country={"ke"}
                      value={form.phone}
                      onChange={(v: any, country: any) => {
                        updateField("phone", v);
                        updateField("country", country?.name || form.country);
                      }}
                      inputStyle={{
                        width: "100%",
                        height: 44,
                        borderRadius: 8,
                        border: "1px solid #D1D5DB",
                        fontSize: "14px",
                        paddingLeft: "48px"
                      }}
                      buttonStyle={{
                        border: "1px solid #D1D5DB",
                        borderRight: "none",
                        borderRadius: "8px 0 0 8px",
                        background: "#F9FAFB"
                      }}
                      dropdownStyle={{
                        borderRadius: 8,
                        border: "1px solid #E5E7EB"
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Shield size={12} />
                      Your number is secure and encrypted
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Email Verification</h2>
                    <p className="text-gray-600 text-sm mt-1">We'll send a code to your email</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</Label>
                    <Input
                      type="email"
                      value={form.email}
                      placeholder="you@example.com"
                      onChange={(e) => updateField("email", e.target.value)}
                      className="h-11 rounded-lg border-gray-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      <Lock size={12} />
                      We'll never share your email
                    </p>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Secure Your Account</h2>
                    <p className="text-gray-600 text-sm mt-1">Create a strong password</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        placeholder="Create a strong password"
                        onChange={(e) => updateField("password", e.target.value)}
                        className="h-11 rounded-lg border-gray-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-200 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Must be at least 8 characters
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={form.confirmPassword}
                        placeholder="Re-enter your password"
                        onChange={(e) => updateField("confirmPassword", e.target.value)}
                        className="h-11 rounded-lg border-gray-300 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all duration-200 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {!verificationStep && (
                <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={goBack}
                    disabled={step === 0}
                    className="rounded-lg px-4 py-2 h-auto border-gray-300 hover:border-gray-400 disabled:opacity-50 text-sm"
                  >
                    <ArrowLeft size={14} className="mr-1" />
                    Back
                  </Button>

                  <Button
                    onClick={step === 4 ? submitSignup : goNext}
                    disabled={!canNext() || loading}
                    className="rounded-lg px-6 py-2 h-auto text-sm font-medium bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 shadow hover:shadow-md transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        {step === 4 ? "Creating..." : "Verifying..."}
                      </div>
                    ) : step === 4 ? (
                      "Create Account"
                    ) : step === 2 || step === 3 ? (
                      `Verify ${step === 2 ? 'Phone' : 'Email'}`
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-medium text-[#FFD700] hover:text-[#FFA500] transition-colors duration-200"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
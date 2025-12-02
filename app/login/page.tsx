// app/login/page.tsx - UPDATED WITH GLOBAL LOADER & STORE INTEGRATION
"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  XCircle,
  CheckCircle,
  Mail,
  Lock,
  Shield,
  Briefcase,
  UserCheck,
  Globe,
  ArrowLeft,
  Key,
} from "lucide-react";
import { 
  useIsLoading, 
  useStartLoading, 
  useStopLoading,
  useSetUser,
  useLogin,
  useInitializeAuth
} from '@/stores';
import { GlobalLoader } from '@/components/global-loader';

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
    image: "/employee4.jpg",
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
    setHasCompleted(false);

    if (v && i < length - 1) {
      const el = document.getElementById(`login-otp-${i + 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !values[i] && i > 0) {
      const el = document.getElementById(`login-otp-${i - 1}`) as HTMLInputElement | null;
      el?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.slice(0, length).split("");
    const next = [...Array(length)].map((_, idx) => digits[idx] || "");
    setValues(next);

    const combined = next.join("");
    if (combined.length === length && !next.includes("")) {
      onComplete(combined);
    } else {
      const firstEmpty = next.findIndex((v) => !v);
      if (firstEmpty >= 0) {
        const el = document.getElementById(`login-otp-${firstEmpty}`) as HTMLInputElement | null;
        el?.focus();
      }
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {values.map((v, i) => (
        <input
          key={i}
          id={`login-otp-${i}`}
          value={v}
          maxLength={1}
          inputMode="numeric"
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center rounded-lg border-2 border-gray-300 text-lg font-bold focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none bg-white transition-all duration-200"
        />
      ))}
    </div>
  );
}

function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Use individual Zustand loading hooks for optimal performance
  const isLoading = useIsLoading();
  const startLoading = useStartLoading();
  const stopLoading = useStopLoading();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startLoading();

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification code");
      }

      setStep("otp");
      setSuccess("Verification code sent to your email");
    } catch (err: any) {
      setError(err.message);
    } finally {
      stopLoading();
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setOtp(code);
    setError("");
    startLoading();

    try {
      const res = await fetch("/api/auth/verify-forgot-password-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      setStep("newPassword");
      setSuccess("Code verified. Please set your new password");
    } catch (err: any) {
      setError(err.message);
    } finally {
      stopLoading();
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    startLoading();

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      stopLoading();
    }
  };

  const resendOtp = async () => {
    setError("");
    startLoading();

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setSuccess("Verification code resent successfully");
    } catch (err: any) {
      setError(err.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Key className="w-6 h-6 text-[#FFD700]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {step === "email" && "Reset Your Password"}
          {step === "otp" && "Verify Your Identity"}
          {step === "newPassword" && "Set New Password"}
        </h2>
        <p className="text-gray-600 text-sm mt-2">
          {step === "email" && "Enter your email to receive a verification code"}
          {step === "otp" && `Enter the code sent to ${email}`}
          {step === "newPassword" && "Create your new password"}
        </p>
      </div>

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

      {/* Email Step */}
      {step === "email" && (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all duration-200 bg-white"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBackToLogin}
              className="flex-1 py-3 rounded-lg border border-gray-300 hover:border-gray-400 text-sm text-gray-700 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Back to Login
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="flex-1 bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 font-semibold py-3 rounded-lg shadow hover:shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Code"
              )}
            </motion.button>
          </div>
        </form>
      )}

      {/* OTP Step */}
      {step === "otp" && (
        <div className="space-y-5">
          <OtpInput onComplete={handleVerifyOtp} />

          <div className="flex gap-3">
            <button
              onClick={() => setStep("email")}
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg border border-gray-300 hover:border-gray-400 text-sm text-gray-700 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <button
              onClick={() => {
                const firstEmpty = document.querySelector('input[value=""]') as HTMLInputElement;
                if (firstEmpty) firstEmpty.focus();
              }}
              disabled={isLoading}
              className="flex-1 bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 font-medium rounded-lg text-sm py-3"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </div>

          <button
            onClick={resendOtp}
            disabled={isLoading}
            className="w-full text-[#FFD700] hover:text-[#FFA500] font-medium text-sm"
          >
            Resend Code
          </button>
        </div>
      )}

      {/* New Password Step */}
      {step === "newPassword" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all duration-200 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all duration-200 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("otp")}
              disabled={isLoading}
              className="flex-1 py-3 rounded-lg border border-gray-300 hover:border-gray-400 text-sm text-gray-700 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="flex-1 bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 font-semibold py-3 rounded-lg shadow hover:shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </motion.button>
          </div>
        </form>
      )}
    </motion.div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [slide, setSlide] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Use individual Zustand loading hooks for optimal performance
  const isLoading = useIsLoading();
  const startLoading = useStartLoading();
  const stopLoading = useStopLoading();
  const setUser = useSetUser();
  const storeLogin = useLogin();
  const initializeAuth = useInitializeAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startLoading();

    try {
      // Option 1: Use store login action (if you have one)
      // const result = await storeLogin(form.email, form.password, rememberMe);
      
      // Option 2: Direct API call with store integration
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rememberMe
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.requiresOtp) {
        setPendingEmail(form.email);
        setOtpStep(true);
        setSuccess("Verification code sent to your email");
      } else {
        // Save user to store immediately if no OTP required
        await handleSuccessfulLogin(data);
      }

    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      stopLoading();
    }
  };

  const getOnboardingRoute = (role: string) => {
    switch (role) {
      case 'EMPLOYEE':
        return '/portals';
      case 'EMPLOYER':
        return '/portals';
      case 'ADMIN':
        return '/portals';
      case 'SUPER_ADMIN':
        return '/portals';
      case 'HOSPITAL_ADMIN':
        return '/portals';
      case 'PHOTO_STUDIO_ADMIN':
        return '/portals';
      case 'EMBASSY_ADMIN':
        return '/portals';
      default:
        return '/portals';
    }
  };

  const getDashboardRoute = (role: string) => {
    switch (role) {
      case 'EMPLOYEE':
        return '/portals/worker/dashboard';
      case 'EMPLOYER':
        return '/portals/employer/dashboard';
      case 'ADMIN':
        return '/portals/admin/dashboard';
      case 'SUPER_ADMIN':
        return '/portals/super-admin/dashboard';
      case 'HOSPITAL_ADMIN':
        return '/portals/hospital/dashboard';
      case 'PHOTO_STUDIO_ADMIN':
        return '/portals/photo-studio/dashboard';
      case 'EMBASSY_ADMIN':
        return '/portals/embassy/dashboard';
      default:
        return '/portals/dashboard';
    }
  };

  const handleSuccessfulLogin = async (data: any) => {
    setSuccess("Login successful! Redirecting...");

    if (data.user) {
      // ✅ SAVE USER TO ZUSTAND STORE
      setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
        permissions: data.user.permissions,
        isSuperAdmin: data.user.isSuperAdmin,
        onboardingCompleted: data.user.onboardingCompleted,
        kycVerified: data.user.kycVerified,
        // Additional user data
        profile: data.user.profile,
        preferences: data.user.preferences,
        lastLogin: new Date().toISOString(),
      });

      // ✅ OPTIONAL: Save to sessionStorage for quick access
      sessionStorage.setItem("user", JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        avatar: data.user.avatar,
        permissions: data.user.permissions,
        isSuperAdmin: data.user.isSuperAdmin,
        onboardingCompleted: data.user.onboardingCompleted,
        kycVerified: data.user.kycVerified,
      }));

      // ✅ Initialize auth state in store
      await initializeAuth();
    }

    setTimeout(async () => {
      try {
        router.refresh();
        await new Promise(resolve => setTimeout(resolve, 100));

        if (data.requiresOnboarding) {
          const onboardingRoute = getOnboardingRoute(data.user.role);
          router.push(onboardingRoute);
        } else {
          const dashboardRoute = getDashboardRoute(data.user.role);
          router.push(dashboardRoute);
        }
      } catch (error) {
        console.error("Redirect error:", error);
        const redirectPath = data.requiresOnboarding
          ? getOnboardingRoute(data.user.role)
          : getDashboardRoute(data.user.role);
        window.location.href = redirectPath;
      }
    }, 1000);
  };

  const handleVerifyOtp = useCallback(async (code: string) => {
    if (!pendingEmail || isVerifying) return;

    setIsVerifying(true);
    startLoading();

    try {
      const res = await fetch("/api/auth/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingEmail,
          otp: code,
          password: form.password
        }),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      await handleSuccessfulLogin(data);

    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      stopLoading();
      setIsVerifying(false);
    }
  }, [pendingEmail, form.password, isVerifying, startLoading, stopLoading]);

  const resendOtp = async () => {
    if (!pendingEmail) return;

    startLoading();
    try {
      const res = await fetch("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code");

      setSuccess("Verification code resent successfully");
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      stopLoading();
    }
  };

  const goBack = () => {
    setOtpStep(false);
    setPendingEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Global Loader - Shows during API calls */}
      <GlobalLoader />
      
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
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === slide ? "bg-[#FFD700] scale-125" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SECTION - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center justify-center gap-3 mb-6">
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
                <h1 className="text-2xl font-bold text-gray-900">
                  {showForgotPassword ? "Reset Password" : otpStep ? "Verify Identity" : "Welcome Back"}
                </h1>
                <p className="text-sm text-gray-600">
                  {showForgotPassword ? "Recover your account" : otpStep ? "Enter verification code" : "Sign in to your secure account"}
                </p>
              </div>
            </div>
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

          {/* Forgot Password Flow */}
          {showForgotPassword && (
            <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
          )}

          {/* OTP Verification Step */}
          {!showForgotPassword && otpStep && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-4"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-[#FFD700]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Verify Your Identity
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Code sent to{" "}
                  <strong className="text-gray-900 break-all">
                    {pendingEmail}
                  </strong>
                </p>

                <OtpInput onComplete={handleVerifyOtp} />

                <div className="flex flex-col gap-3 mt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={goBack}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-lg border border-gray-300 hover:border-gray-400 text-sm text-gray-700 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft size={14} />
                      Back
                    </button>
                    <button
                      onClick={() => {
                        const firstEmpty = document.querySelector('input[value=""]') as HTMLInputElement;
                        if (firstEmpty) firstEmpty.focus();
                      }}
                      disabled={isLoading}
                      className="flex-1 bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 font-medium rounded-lg text-sm py-2"
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </button>
                  </div>
                  <button
                    onClick={resendOtp}
                    disabled={isLoading}
                    className="text-[#FFD700] hover:text-[#FFA500] font-medium text-xs"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Password Login Form */}
          {!showForgotPassword && !otpStep && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <form onSubmit={handlePasswordLogin} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all duration-200 bg-white"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-[#FFD700] hover:text-[#FFA500] font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all duration-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#FFD700] focus:ring-[#FFD700] border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Login Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full bg-[#FFD700] hover:bg-[#FFA500] text-gray-900 font-semibold py-3 rounded-lg shadow hover:shadow-md transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to Kazipert?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="text-sm font-medium text-[#FFD700] hover:text-[#FFA500] transition-colors duration-200"
                >
                  Create your secure account
                </button>
              </div>
            </motion.div>
          )}

          {/* Security Notice */}
          {!showForgotPassword && (
            <div className="text-center mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                <Shield size={14} className="text-[#FFD700]" />
                <span className="font-medium">Secure Login</span>
              </div>
              <p className="text-xs text-gray-500">
                Your data is protected with bank-level encryption
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component that wraps with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
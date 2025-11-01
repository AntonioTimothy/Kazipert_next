"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserByEmailAndRole } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [userType, setUserType] = useState<"worker" | "employer" | "admin">("worker")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication
    const user = getUserByEmailAndRole(email, userType)

    if (user) {
      // Store user in session (in real app, use proper auth)
      sessionStorage.setItem("user", JSON.stringify(user))

      // Redirect based on user type
      if (userType === "worker") {
        console.log("Redirecting to worker dashboard>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        router.push("/worker/dashboard")
      } else if (userType === "employer") {
        router.push("/employer/dashboard")
      } else if (userType === "admin") {
        router.push("/admin/dashboard")
      }
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Back to home */}
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to Kazipert</h1>
        <p className="text-muted-foreground">Sign in to access your portal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Choose your account type and enter your credentials</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as typeof userType)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="worker">Worker</TabsTrigger>
              <TabsTrigger value="employer">Employer</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-xs">
              <div>
                <strong>Worker:</strong> amina.hassan@email.com
              </div>
              <div>
                <strong>Employer:</strong> ahmed.alkindi@email.com
              </div>
              <div>
                <strong>Admin:</strong> admin@kazipert.com
              </div>
              <div className="text-muted-foreground">Password: any password</div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  User, 
  Bell, 
  Briefcase, 
  Home,
  Search,
  MessageSquare,
  BarChart3,
  Shield,
  ChevronLeft,
  ChevronRight,
  Star,
  Crown,
  Zap,
  Sparkles,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  HelpCircle,
  Mail,
  FileText,
  Key,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PortalLayoutProps {
  children: React.ReactNode
  navigation: Array<{
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
  }>
  user: {
    name: string
    email: string
    avatar?: string
    role: string
    verified?: boolean
  }
  notificationCount?: number
}

export function PortalLayout({ children, navigation, user, notificationCount = 3 }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showJobsPopup, setShowJobsPopup] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Clear all user data from storage
    sessionStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    
    // Clear any other user-related data
    localStorage.removeItem("kazipert_user")
    sessionStorage.clear()
    
    // Redirect to login page
    router.push("/login")
    
    // Force reload to ensure clean state
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  // Get current route name for breadcrumb
  const getCurrentRouteName = () => {
    const currentRoute = navigation.find(item => item.href === pathname)
    return currentRoute?.name || "Dashboard"
  }

  // Limit to top 5 for mobile nav - keep original order
  const mobileNav = navigation?.slice(0, 5)

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-white via-amber-50/20 to-amber-50/10">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform border-r border-amber-200/40 bg-white/98 backdrop-blur-xl shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-20" : "w-64",
          "hidden lg:flex lg:flex-col"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-amber-200/40">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-3 transition-all duration-300",
              sidebarCollapsed ? "justify-center w-full" : ""
            )}
          >
            <div className="relative">
              <Image
                src="/logo.svg"
                alt="Kazipert"
                width={140}
                height={140}
                className="transition-all duration-300"
                priority
              />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#f5c849] rounded-full border border-white" />
            </div>
          </Link>
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-amber-100/60 transition-all rounded-lg"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-amber-700" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-amber-700" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation?.map((item) => {
            const isActive = pathname === item.href
            return (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                    isActive
                      ? "bg-[#f5c849] text-amber-900 shadow-lg shadow-amber-200/50"
                      : "text-gray-700 hover:bg-amber-50/80 hover:text-amber-800",
                    sidebarCollapsed ? "justify-center" : ""
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={cn(
                    "transition-all duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-amber-900" : "text-amber-700"
                    )} />
                  </div>
                  
                  {!sidebarCollapsed && (
                    <span className="flex-1 font-semibold">{item.name}</span>
                  )}
                  
                  {item.badge && !sidebarCollapsed && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center",
                      isActive
                        ? "bg-amber-800/10 text-amber-900"
                        : "bg-amber-500/10 text-amber-700"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
                    {item.name}
                    {item.badge && (
                      <span className="ml-1 px-1 bg-[#f5c849] text-amber-900 rounded text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Complete Profile CTA */}
          {!sidebarCollapsed && (
            <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-amber-500/5 to-amber-600/5 border border-amber-200/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-amber-700" />
                <span className="text-xs font-bold text-amber-800">Complete Profile</span>
              </div>
              <p className="text-xs text-amber-700/80 mb-3">Verify your account to access all features</p>
              <Button className="w-full h-8 bg-[#f5c849] hover:bg-amber-500 text-amber-900 font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-lg text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verify Now
              </Button>
            </div>
          )}
        </nav>

        {/* User Info in Sidebar */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-amber-200/40">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-amber-50/50">
              <Avatar className="h-8 w-8 ring-1 ring-amber-400/30">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="bg-[#f5c849] text-amber-900 text-sm font-bold">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-900 truncate">{user?.name}</p>
                <p className="text-xs text-amber-700/70 truncate capitalize">{user?.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className={cn(
        "flex flex-1 flex-col overflow-hidden transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
      )}>
        {/* Enhanced Header */}
        <header className="flex h-16 items-center justify-between border-b border-amber-200/40 bg-white/90 backdrop-blur-xl px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden hover:bg-amber-100/60 transition-all rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-amber-700" />
            </Button>
            
            {/* Dynamic Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Home className="h-4 w-4 text-amber-600" />
              <span>/</span>
              <span className="font-semibold text-amber-900">{getCurrentRouteName()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
              <input
                type="text"
                placeholder="Search jobs, candidates..."
                className="pl-10 pr-4 py-2 bg-amber-50/70 border border-amber-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f5c849]/30 focus:border-[#f5c849]/50 transition-all w-64 text-sm placeholder-amber-700/50 text-amber-900"
              />
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-amber-100/60 transition-all rounded-lg group">
                    <Bell className="h-5 w-5 text-amber-700 group-hover:text-amber-800 transition-colors" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#f5c849] text-xs font-bold text-amber-900 shadow-lg">
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 border border-amber-200/50 shadow-2xl rounded-xl p-3 bg-white/95 backdrop-blur-xl z-[99]">                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-amber-900 text-sm">Notifications</h3>
                    <span className="text-xs text-amber-800 font-semibold bg-amber-100 px-2 py-1 rounded-full">
                      {notificationCount} new
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200/30">
                      <p className="text-sm font-medium text-amber-900">Complete your profile</p>
                      <p className="text-xs text-amber-700/80 mt-1">Verify your account to unlock all features</p>
                      <span className="text-xs text-amber-600 mt-1 block">Just now</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200/30">
                      <p className="text-sm font-medium text-amber-900">Profile viewed</p>
                      <p className="text-xs text-amber-700/80 mt-1">Your profile was viewed by 5 employers</p>
                      <span className="text-xs text-amber-600 mt-1 block">5 hours ago</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full mt-2 text-amber-700 hover:bg-amber-100/50 rounded-lg text-sm font-medium">
                    View all notifications
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced User Dropdown with Logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hover:bg-amber-100/60 transition-all rounded-lg px-2 py-1 group"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-amber-400/30 group-hover:ring-amber-400/50 transition-all duration-300">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#f5c849] to-amber-500 text-amber-900 text-sm font-bold shadow-md">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {!user?.verified && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-amber-500 shadow-sm" />
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="text-sm font-semibold text-amber-900 leading-tight">{user?.name}</span>
                      <span className={cn(
                        "text-xs leading-tight flex items-center gap-1 font-medium",
                        user?.verified ? "text-green-600" : "text-amber-600"
                      )}>
                        {user?.verified ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Pending Verification
                          </>
                        )}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-amber-600 hidden sm:block transition-transform group-hover:rotate-180 duration-300" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-80 border border-amber-200/50 shadow-2xl rounded-2xl bg-white/95 backdrop-blur-xl overflow-hidden z-[99]"
                  >
                  {/* User Header Section */}
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 border-b border-amber-200/40">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-amber-400/30 shadow-md">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#f5c849] to-amber-500 text-amber-900 text-lg font-bold">
                          {getUserInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-amber-900 text-sm truncate">{user?.name}</h3>
                        <p className="text-xs text-amber-700/80 truncate mt-1">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                            user?.verified 
                              ? "bg-green-100 text-green-700" 
                              : "bg-amber-100 text-amber-700"
                          )}>
                            {user?.verified ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3" />
                                Pending
                              </>
                            )}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold capitalize">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="p-3 border-b border-amber-200/30 bg-amber-50/30">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-white/50 border border-amber-200/30">
                        <div className="text-sm font-bold text-amber-900">12</div>
                        <div className="text-xs text-amber-600">Jobs</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/50 border border-amber-200/30">
                        <div className="text-sm font-bold text-amber-900">5</div>
                        <div className="text-xs text-amber-600">Applied</div>
                      </div>
                      <div className="p-2 rounded-lg bg-white/50 border border-amber-200/30">
                        <div className="text-sm font-bold text-amber-900">3</div>
                        <div className="text-xs text-amber-600">Messages</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Menu Items */}
                  <div className="p-2">
                    <DropdownMenuLabel className="text-xs font-semibold text-amber-700/70 px-2 py-1">
                      ACCOUNT
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem className="flex items-center gap-3 rounded-xl p-3 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-[#f5c849] transition-colors duration-200">
                        <User className="h-4 w-4 text-amber-700 group-hover:text-amber-900" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-900 text-sm">My Profile</span>
                        <p className="text-xs text-amber-600/70">View and edit your profile</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-400 group-hover:text-amber-600" />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 rounded-xl p-3 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-[#f5c849] transition-colors duration-200">
                        <Settings className="h-4 w-4 text-amber-700 group-hover:text-amber-900" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-900 text-sm">Account Settings</span>
                        <p className="text-xs text-amber-600/70">Privacy, security, and preferences</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-400 group-hover:text-amber-600" />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 rounded-xl p-3 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-[#f5c849] transition-colors duration-200">
                        <CreditCard className="h-4 w-4 text-amber-700 group-hover:text-amber-900" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-900 text-sm">Billing & Plans</span>
                        <p className="text-xs text-amber-600/70">Manage your subscription</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-400 group-hover:text-amber-600" />
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 rounded-xl p-3 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-[#f5c849] transition-colors duration-200">
                        <Lock className="h-4 w-4 text-amber-700 group-hover:text-amber-900" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-900 text-sm">Privacy & Security</span>
                        <p className="text-xs text-amber-600/70">Manage your security settings</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-amber-400 group-hover:text-amber-600" />
                    </DropdownMenuItem>
                  </div>

                  {/* Support Section */}
                  <div className="p-2 border-t border-amber-200/30">
                    <DropdownMenuLabel className="text-xs font-semibold text-amber-700/70 px-2 py-1">
                      SUPPORT
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem className="flex items-center gap-3 rounded-xl p-3 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-[#f5c849] transition-colors duration-200">
                        <HelpCircle className="h-4 w-4 text-amber-700 group-hover:text-amber-900" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-900 text-sm">Help & Support</span>
                        <p className="text-xs text-amber-600/70">Get help and documentation</p>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="flex items-center gap-3 rounded-xl p-3 hover:bg-amber-50 cursor-pointer transition-all duration-200 group">
                      <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-[#f5c849] transition-colors duration-200">
                        <Mail className="h-4 w-4 text-amber-700 group-hover:text-amber-900" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-amber-900 text-sm">Contact Us</span>
                        <p className="text-xs text-amber-600/70">Reach out to our team</p>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Logout Section - Prominently Displayed */}
                  <div className="p-2 border-t border-amber-200/30 bg-red-50/30">
                    <DropdownMenuLabel className="text-xs font-semibold text-red-700/70 px-2 py-1">
                      SESSION
                    </DropdownMenuLabel>
                    
                    <DropdownMenuItem 
                      onSelect={handleLogout}
                      className="flex items-center gap-3 rounded-xl p-3 hover:bg-red-100 cursor-pointer transition-all duration-200 group mt-2"
                    >
                      <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-500 transition-colors duration-200">
                        <LogOut className="h-4 w-4 text-red-600 group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-red-700 text-sm">Sign Out</span>
                        <p className="text-xs text-red-600/70">Securely log out of your account</p>
                      </div>
                    </DropdownMenuItem>
                  </div>

                  {/* Footer */}
                  <div className="p-3 bg-amber-50/50 border-t border-amber-200/30">
                    <div className="text-xs text-amber-600/60 text-center">
                      Kazipert v2.1.0 • Global Talent Platform
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-white via-amber-50/10 to-amber-50/5 p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {/* {children} */}
          </div>
        </main>

        {/* Enhanced Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-amber-200/40 bg-white/95 backdrop-blur-xl px-4 py-2 shadow-2xl lg:hidden">
          {mobileNav?.map((item, i) => {
            const isActive = pathname === item.href
            const isMiddle = i === 2 // center icon

            return (
              <div key={item.name} className="flex-1 flex justify-center">
                {isMiddle ? (
                  <button
                    onClick={() => setShowJobsPopup(!showJobsPopup)}
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-white shadow-lg transition-all duration-300 hover:scale-110",
                      showJobsPopup
                        ? "bg-[#f5c849] text-amber-900 scale-110 shadow-xl"
                        : "bg-[#f5c849] text-amber-900 hover:shadow-xl",
                    )}
                  >
                    <Briefcase className="h-5 w-5" />
                    {showJobsPopup && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-amber-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                        Quick Actions
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center text-xs transition-all duration-300 flex-1",
                      isActive 
                        ? "text-amber-900 font-bold" 
                        : "text-amber-700 hover:text-amber-900",
                    )}
                    onClick={() => setShowJobsPopup(false)}
                  >
                    <div className={cn(
                      "p-2 rounded-xl mb-1 transition-all duration-300",
                      isActive 
                        ? "bg-[#f5c849] shadow-md" 
                        : "hover:bg-amber-100/60"
                    )}>
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform duration-300",
                        isActive && "scale-110"
                      )} />
                    </div>
                    <span className="font-medium text-[10px]">{item.name}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
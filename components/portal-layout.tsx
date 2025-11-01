"use client"

import type React from "react"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigation } from "@/hooks/useNavigation"

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
  Lock,
  Palette,
  Loader2,
  ChevronUp,
  ChevronRight as ChevronRightIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from '@/contexts/ThemeContext'
import { ThemeChanger } from '@/components/ThemeChanger'

interface PortalLayoutProps {
  children: React.ReactNode
 
  user: {
    name: string
    email: string
    avatar?: string
    role: string
    verified?: boolean
  }
  notificationCount?: number
}

// Custom Dropdown Components
interface CustomDropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "start" | "end" | "center"
  className?: string
  maxHeight?: string
}

function CustomDropdown({ trigger, children, align = "end", className, maxHeight = "400px" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const alignmentClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 transform -translate-x-1/2"
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>
      {isOpen && (
        <div 
          className={cn(
            "absolute top-full mt-2 min-w-[280px] rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl z-[1000] overflow-hidden",
            alignmentClasses[align],
            className
          )}
          style={{ maxHeight }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function CustomDropdownItem({ 
  children, 
  onClick,
  className 
}: { 
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-primary/5 border-b border-border/30 last:border-b-0",
        className
      )}
    >
      {children}
    </div>
  )
}

function CustomDropdownLabel({ 
  children,
  className 
}: { 
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-4 py-2 text-xs font-semibold text-primary/70 uppercase tracking-wide bg-primary/5 sticky top-0 z-10", className)}>
      {children}
    </div>
  )
}

function CustomDropdownSeparator() {
  return <div className="border-t border-border/30 my-1" />
}

function ScrollableDropdownContent({ children, maxHeight = "320px" }: { children: React.ReactNode; maxHeight?: string }) {
  return (
    <div 
      className="overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent"
      style={{ maxHeight }}
    >
      {children}
    </div>
  )
}

// Navigation Item Component with Nested Support
interface NavigationItemProps {
  item: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
    children?: Array<{
      name: string
      href: string
      icon: React.ComponentType<{ className?: string }>
      badge?: string
    }>
  }
  isActive: boolean
  sidebarCollapsed: boolean
  currentTheme: any
  pathname: string
  onItemClick: () => void
}

function NavigationItem({ item, isActive, sidebarCollapsed, currentTheme, pathname, onItemClick }: NavigationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = (e: React.MouseEvent) => {
    if (hasChildren && !sidebarCollapsed) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    } else {
      onItemClick()
    }
  }

  const isChildActive = hasChildren && item.children?.some(child => child.href === pathname)

  return (
    <div className="relative group">
      {/* Main Navigation Item */}
      <Link
        href={hasChildren ? '#' : item.href}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 rounded-xl p-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
          isActive || isChildActive
            ? "text-primary-foreground shadow-lg shadow-primary/20"
            : "text-text-muted hover:bg-primary/5 hover:text-text",
          sidebarCollapsed ? "justify-center" : "",
          hasChildren ? "cursor-pointer" : ""
        )}
        style={{
          backgroundColor: (isActive || isChildActive) ? currentTheme.colors.primary : 'transparent',
          color: (isActive || isChildActive) ? currentTheme.colors.text : undefined
        }}
      >
        <div className={cn(
          "transition-all duration-200",
          (isActive || isChildActive) ? "scale-110" : "group-hover:scale-110"
        )}>
          <item.icon className={cn(
            "h-5 w-5 transition-colors",
            (isActive || isChildActive) ? "text-primary-foreground" : "text-current"
          )} />
        </div>
        
        {!sidebarCollapsed && (
          <>
            <span className="flex-1 font-semibold text-left">{item.name}</span>
            
            {/* Badge and Chevron */}
            <div className="flex items-center gap-1">
              {item.badge && (
                <span 
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center"
                  style={{
                    backgroundColor: (isActive || isChildActive) ? 'rgba(255,255,255,0.2)' : `${currentTheme.colors.primary}20`,
                    color: (isActive || isChildActive) ? 'currentColor' : currentTheme.colors.primary
                  }}
                >
                  {item.badge}
                </span>
              )}
              
              {hasChildren && (
                <ChevronRightIcon 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isExpanded ? "rotate-90" : ""
                  )} 
                />
              )}
            </div>
          </>
        )}
      </Link>

      {/* Nested Children */}
      {hasChildren && !sidebarCollapsed && isExpanded && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-primary/20 pl-2">
          {item.children.map((child) => {
            const isChildActive = pathname === child.href
            return (
              <Link
                key={child.name}
                href={child.href}
                onClick={onItemClick}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-2 text-sm transition-all duration-200 hover:scale-[1.02]",
                  isChildActive
                    ? "text-primary-foreground shadow-md shadow-primary/10"
                    : "text-text-muted hover:bg-primary/5 hover:text-text"
                )}
                style={{
                  backgroundColor: isChildActive ? currentTheme.colors.primary : 'transparent',
                  color: isChildActive ? currentTheme.colors.text : undefined
                }}
              >
                <child.icon className={cn(
                  "h-4 w-4",
                  isChildActive ? "text-primary-foreground" : "text-current"
                )} />
                <span className="flex-1 font-medium text-sm">{child.name}</span>
                {child.badge && (
                  <span 
                    className="px-1.5 py-0.5 rounded-full text-xs font-bold min-w-[18px] text-center"
                    style={{
                      backgroundColor: isChildActive ? 'rgba(255,255,255,0.2)' : `${currentTheme.colors.primary}20`,
                      color: isChildActive ? 'currentColor' : currentTheme.colors.primary
                    }}
                  >
                    {child.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {sidebarCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap shadow-lg">
          {item.name}
          {item.badge && (
            <span 
              className="ml-1 px-1 rounded text-[10px] font-bold"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: currentTheme.colors.text
              }}
            >
              {item.badge}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function PortalLayout({ children, user, notificationCount = 3 }: PortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showJobsPopup, setShowJobsPopup] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { currentTheme } = useTheme()
  
  // Dynamic navigation based on user role and permissions
  const { 
    navigation, 
    getCurrentRouteName, 
    getMobileNavigation,
    isLoading 
  } = useNavigation()

  const handleLogout = async () => {
    try {
      // Call logout API first
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        throw new Error('Logout API call failed')
      }
  
      // Clear all user data from storage
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("onboarding_state")
      sessionStorage.removeItem("auth-storage")
      
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("kazipert_user")
      localStorage.removeItem("auth-storage")
      
      // Clear any other app-specific storage
      const appKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('kazipert_') || 
        key.startsWith('onboarding_') ||
        key.startsWith('auth_')
      )
      appKeys.forEach(key => localStorage.removeItem(key))
  
      // Clear session storage completely for security
      sessionStorage.clear()
  
      // Clear any service worker caches if used
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName)
          })
        })
      }
  
      console.log('Logout successful - all data cleared')
  
      // Redirect to login page
      router.push("/login")
      
      // Force reload to ensure clean state and clear any memory
      setTimeout(() => {
        window.location.reload()
      }, 100)
  
    } catch (error) {
      console.error('Logout error:', error)
      
      // Even if API call fails, clear client-side data and redirect
      sessionStorage.clear()
      localStorage.clear()
      
      // Redirect to login page with error parameter
      router.push("/login?error=logout_failed")
      
      // Still force reload for clean state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }

  // Get flat navigation for mobile (no nested items)
  const getFlatNavigationForMobile = () => {
    const flatNav: any[] = []
    navigation?.forEach(item => {
      // Add parent item if it has a direct href
      if (item.href !== '#') {
        flatNav.push(item)
      }
      // Add all children
      if (item.children) {
        flatNav.push(...item.children)
      }
    })
    return flatNav.slice(0, 5) // Limit to 5 items for mobile
  }

  const mobileNav = getFlatNavigationForMobile()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-theme-primary" />
          <p className="text-theme-text-muted">Loading</p>
        </div>
      </div>
    )
  }

  // Get user initials for avatar
  const getUserInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string') {
      return 'U'
    }
    
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-background via-background-light to-background-light/50">
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
          "fixed inset-y-0 left-0 z-50 transform border-r border-border/40 bg-background/98 backdrop-blur-xl shadow-xl transition-all duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-20" : "w-64",
          "hidden lg:flex lg:flex-col"
        )}
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.colors.background} 0%, ${currentTheme.colors.backgroundLight} 100%)`
        }}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b border-border/40">
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
              <div 
                className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full border border-white"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
            </div>
          </Link>
          
          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-primary/10 transition-all rounded-lg"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-primary" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-primary" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navigation?.map((item) => {
            const isActive = pathname === item.href
            return (
              <NavigationItem
                key={item.name}
                item={item}
                isActive={isActive}
                sidebarCollapsed={sidebarCollapsed}
                currentTheme={currentTheme}
                pathname={pathname}
                onItemClick={() => setSidebarOpen(false)}
              />
            )
          })}

          {/* Complete Profile CTA */}
          {!sidebarCollapsed && (
            <div 
              className="mt-4 p-3 rounded-xl border border-border/50"
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.primary}05, ${currentTheme.colors.primary}10)`
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-text">Complete Profile</span>
              </div>
              <p className="text-xs text-text-muted mb-3">Verify your account to access all features</p>
              <Link href="/worker/onboarding" className="block">
                <Button 
                  className="w-full h-8 text-text font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-lg text-xs"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    color: currentTheme.colors.text
                  }}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verify Now
                </Button>
              </Link>
            </div>
          )}
        </nav>

        {/* User Info in Sidebar */}
        {!sidebarCollapsed && (
          <div className="p-3 border-t border-border/40">
            <div 
              className="flex items-center gap-3 p-2 rounded-lg"
              style={{ backgroundColor: `${currentTheme.colors.primary}08` }}
            >
              <Avatar className="h-8 w-8 ring-1 ring-primary/30">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback 
                  className="text-text text-sm font-bold"
                  style={{ backgroundColor: currentTheme.colors.primary }}
                >
                  {getUserInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text truncate">{user?.name}</p>
                <p className="text-xs text-text-muted truncate capitalize">{user?.role}</p>
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
        <header 
          className="flex h-16 items-center justify-between border-b border-border/40 bg-background/90 backdrop-blur-xl px-4 lg:px-6 shadow-sm relative z-40"
        >
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden hover:bg-primary/10 transition-all rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-primary" />
            </Button>
            
            {/* Dynamic Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Home className="h-4 w-4 text-primary" />
              <span>/</span>
              <span className="font-semibold text-text">{getCurrentRouteName()}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Changer */}
            <ThemeChanger />

            {/* Enhanced Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <input
                type="text"
                placeholder="Search jobs, candidates..."
                className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all w-64 text-sm placeholder-text-muted text-text"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}05`
                }}
              />
            </div>

            {/* User Profile Section */}
            <div className="flex items-center gap-2">
              {/* Notifications - Custom Dropdown */}
              <CustomDropdown
                trigger={
                  <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all rounded-lg group">
                    <Bell className="h-5 w-5 text-primary group-hover:text-primary-dark transition-colors" />
                    {notificationCount > 0 && (
                      <span 
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-text shadow-lg"
                        style={{ backgroundColor: currentTheme.colors.primary }}
                      >
                        {notificationCount}
                      </span>
                    )}
                  </Button>
                }
                align="end"
                className="w-80"
                maxHeight="400px"
              >
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-text text-sm">Notifications</h3>
                    <span 
                      className="text-xs text-text font-semibold px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${currentTheme.colors.primary}15` }}
                    >
                      {notificationCount} new
                    </span>
                  </div>
                  <ScrollableDropdownContent maxHeight="280px">
                    <div className="space-y-2">
                      <div 
                        className="p-2 rounded-lg border border-border/30"
                        style={{ backgroundColor: `${currentTheme.colors.primary}05` }}
                      >
                        <p className="text-sm font-medium text-text">Complete your profile</p>
                        <p className="text-xs text-text-muted mt-1">Verify your account to unlock all features</p>
                        <span className="text-xs text-primary mt-1 block">Just now</span>
                      </div>
                      <div 
                        className="p-2 rounded-lg border border-border/30"
                        style={{ backgroundColor: `${currentTheme.colors.primary}05` }}
                      >
                        <p className="text-sm font-medium text-text">Profile viewed</p>
                        <p className="text-xs text-text-muted mt-1">Your profile was viewed by 5 employers</p>
                        <span className="text-xs text-primary mt-1 block">5 hours ago</span>
                      </div>
                    </div>
                  </ScrollableDropdownContent>
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-text-muted hover:bg-primary/5 rounded-lg text-sm font-medium"
                  >
                    View all notifications
                  </Button>
                </div>
              </CustomDropdown>

              {/* Enhanced User Dropdown with Logout - Custom Dropdown */}
              <CustomDropdown
                trigger={
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-2 hover:bg-primary/10 transition-all rounded-lg px-2 py-1 group"
                  >
                    <div className="relative">
                      <Avatar className="h-8 w-8 ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all duration-300">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback 
                          className="text-text text-sm font-bold shadow-md"
                          style={{ 
                            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.primaryDark})`
                          }}
                        >
                          {getUserInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      {!user?.verified && (
                        <div 
                          className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: currentTheme.colors.primary }}
                        />
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start text-left">
                      <span className="text-sm font-semibold text-text leading-tight">{user?.name}</span>
                      <span className={cn(
                        "text-xs leading-tight flex items-center gap-1 font-medium",
                        user?.verified ? "text-success" : "text-primary"
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
                    <ChevronDown className="h-4 w-4 text-primary hidden sm:block transition-transform group-hover:rotate-180 duration-300" />
                  </Button>
                }
                align="end"
                className="w-80"
                maxHeight="500px"
              >
                <ScrollableDropdownContent maxHeight="460px">
                  {/* User Header Section */}
                  <div 
                    className="p-4 border-b border-border/40"
                    style={{ 
                      background: `linear-gradient(135deg, ${currentTheme.colors.primary}08, ${currentTheme.colors.primary}15)`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/30 shadow-md">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback 
                          className="text-text text-lg font-bold"
                          style={{ 
                            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.primaryDark})`
                          }}
                        >
                          {getUserInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-text text-sm truncate">{user?.name}</h3>
                        <p className="text-xs text-text-muted truncate mt-1">{user?.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                            user?.verified 
                              ? "bg-success/10 text-success" 
                              : "bg-primary/10 text-primary"
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
                          <span 
                            className="px-2 py-1 rounded-full text-xs font-semibold capitalize"
                            style={{ 
                              backgroundColor: `${currentTheme.colors.primary}15`,
                              color: currentTheme.colors.primary
                            }}
                          >
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div 
                    className="p-3 border-b border-border/30"
                    style={{ backgroundColor: `${currentTheme.colors.primary}03` }}
                  >
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                        <div className="text-sm font-bold text-text">12</div>
                        <div className="text-xs text-text-muted">Jobs</div>
                      </div>
                      <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                        <div className="text-sm font-bold text-text">5</div>
                        <div className="text-xs text-text-muted">Applied</div>
                      </div>
                      <div className="p-2 rounded-lg bg-background/50 border border-border/30">
                        <div className="text-sm font-bold text-text">3</div>
                        <div className="text-xs text-text-muted">Messages</div>
                      </div>
                    </div>
                  </div>

                  {/* Main Menu Items */}
                  <div>
                    <CustomDropdownLabel>ACCOUNT</CustomDropdownLabel>
                    
                    <CustomDropdownItem>
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                        >
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-text text-sm">My Profile</span>
                          <p className="text-xs text-text-muted">View and edit your profile</p>
                        </div>
                        <ChevronRightIcon className="h-4 w-4 text-primary/60" />
                      </div>
                    </CustomDropdownItem>

                    {/* ... other menu items with same pattern ... */}

                  </div>

                  <CustomDropdownSeparator />

                  {/* Support Section */}
                  <div>
                    <CustomDropdownLabel>SUPPORT</CustomDropdownLabel>
                    
                    <CustomDropdownItem>
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${currentTheme.colors.primary}10` }}
                        >
                          <HelpCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-text text-sm">Help & Support</span>
                          <p className="text-xs text-text-muted">Get help and documentation</p>
                        </div>
                      </div>
                    </CustomDropdownItem>
                  </div>

                  <CustomDropdownSeparator />

                  {/* Logout Section */}
                  <div style={{ backgroundColor: `${currentTheme.colors.error}05` }}>
                    <CustomDropdownLabel className="text-error/70">SESSION</CustomDropdownLabel>
                    
                    <CustomDropdownItem 
                      onClick={handleLogout}
                      className="hover:bg-error/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-error/10 rounded-lg">
                          <LogOut className="h-4 w-4 text-error" />
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-error text-sm">Sign Out</span>
                          <p className="text-xs text-error/70">Securely log out of your account</p>
                        </div>
                      </div>
                    </CustomDropdownItem>
                  </div>

                  {/* Footer */}
                  <div 
                    className="p-3 border-t border-border/30"
                    style={{ backgroundColor: `${currentTheme.colors.primary}05` }}
                  >
                    <div className="text-xs text-text-muted text-center">
                      Kazipert v2.1.0 • Global Talent Platform
                    </div>
                  </div>
                </ScrollableDropdownContent>
              </CustomDropdown>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background-light/10 to-background-light/5 p-4 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Enhanced Mobile Bottom Navigation */}
        <nav 
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border/40 bg-background/95 backdrop-blur-xl px-4 py-2 shadow-2xl lg:hidden"
        >
          {mobileNav?.map((item, i) => {
            const isActive = pathname === item.href
            const isMiddle = i === 2

            return (
              <div key={item.name} className="flex-1 flex justify-center">
                {isMiddle ? (
                  <button
                    onClick={() => setShowJobsPopup(!showJobsPopup)}
                    className={cn(
                      "relative flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-background shadow-lg transition-all duration-300 hover:scale-110",
                      showJobsPopup
                        ? "scale-110 shadow-xl"
                        : "hover:shadow-xl",
                    )}
                    style={{
                      backgroundColor: currentTheme.colors.primary,
                      color: currentTheme.colors.text
                    }}
                  >
                    <Briefcase className="h-5 w-5" />
                    {showJobsPopup && (
                      <div 
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap"
                        style={{ backgroundColor: currentTheme.colors.primaryDark }}
                      >
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
                        ? "text-text font-bold" 
                        : "text-text-muted hover:text-text",
                    )}
                    onClick={() => setShowJobsPopup(false)}
                  >
                    <div 
                      className={cn(
                        "p-2 rounded-xl mb-1 transition-all duration-300",
                        isActive 
                          ? "shadow-md" 
                          : "hover:bg-primary/5"
                      )}
                      style={{
                        backgroundColor: isActive ? currentTheme.colors.primary : 'transparent'
                      }}
                    >
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
"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Users,
  Building,
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  Globe,
  Phone,
  Calendar,
  RefreshCw,
  Play,
  Pause,
  Wifi,
  Signal,
  Maximize2,
  Minimize2,
  MapPin,
  Eye,
  ArrowUpRight,
  UserCheck,
  Building2,
  Flag,
  UserCog,
  Briefcase,
  AlertOctagon,
  TrendingDown,
  Map,
  BarChart,
  PieChart,
  DownloadCloud,
  Scale,
  GitMerge,
  UserPlus,
  Users2,
  Target,
  Shield,
  MessageCircle,
  PhoneCall,
  GitPullRequest,
  Heart,
  Zap,
  Crown
} from "lucide-react"

// Comprehensive mock data for Kazipert operations - No Revenue Data
const generateKazipertData = () => {
  const baseTime = Date.now()
  const timeFactor = baseTime / 1000
  
  // Oman regions with detailed operational metrics
  const omanRegions = [
    { 
      name: "Muscat", 
      employers: 2341, 
      activeEmployers: 1892,
      issues: 45, 
      issueRate: 1.9, 
      totalWorkers: 6543,
      disputes: 23,
      cases: 67,
      jobPostings: 156,
      applications: 892,
      accepted: 234,
      whistleBlowing: 5,
      satisfaction: 94.2,
      coordinates: { x: 75, y: 45 }
    },
    { 
      name: "Salalah", 
      employers: 892, 
      activeEmployers: 712,
      issues: 28, 
      issueRate: 3.1, 
      totalWorkers: 2341,
      disputes: 15,
      cases: 42,
      jobPostings: 89,
      applications: 456,
      accepted: 123,
      whistleBlowing: 3,
      satisfaction: 91.5,
      coordinates: { x: 40, y: 70 }
    },
    { 
      name: "Sohar", 
      employers: 567, 
      activeEmployers: 445,
      issues: 34, 
      issueRate: 6.0, 
      totalWorkers: 1567,
      disputes: 18,
      cases: 39,
      jobPostings: 67,
      applications: 345,
      accepted: 89,
      whistleBlowing: 7,
      satisfaction: 89.8,
      coordinates: { x: 55, y: 35 }
    },
    { 
      name: "Nizwa", 
      employers: 423, 
      activeEmployers: 334,
      issues: 19, 
      issueRate: 4.5, 
      totalWorkers: 892,
      disputes: 12,
      cases: 28,
      jobPostings: 45,
      applications: 234,
      accepted: 67,
      whistleBlowing: 2,
      satisfaction: 92.3,
      coordinates: { x: 60, y: 50 }
    }
  ]

  // Kenya regions with detailed operational metrics
  const kenyaRegions = [
    { 
      name: "Nairobi", 
      workers: 8456, 
      activeWorkers: 7123,
      applicants: 1234, 
      issues: 67, 
      issueRate: 0.8, 
      disputes: 34,
      cases: 89,
      newRegistrations: 156,
      placementRate: 94.2,
      whistleBlowing: 12,
      avgResponseTime: 2.3
    },
    { 
      name: "Mombasa", 
      workers: 3456, 
      activeWorkers: 2890,
      applicants: 567, 
      issues: 45, 
      issueRate: 1.3, 
      disputes: 23,
      cases: 56,
      newRegistrations: 78,
      placementRate: 91.5,
      whistleBlowing: 8,
      avgResponseTime: 3.1
    },
    { 
      name: "Kisumu", 
      workers: 2345, 
      activeWorkers: 1987,
      applicants: 345, 
      issues: 34, 
      issueRate: 1.5, 
      disputes: 18,
      cases: 45,
      newRegistrations: 56,
      placementRate: 89.8,
      whistleBlowing: 6,
      avgResponseTime: 2.8
    },
    { 
      name: "Nakuru", 
      workers: 1876, 
      activeWorkers: 1567,
      applicants: 278, 
      issues: 23, 
      issueRate: 1.2, 
      disputes: 14,
      cases: 34,
      newRegistrations: 45,
      placementRate: 92.3,
      whistleBlowing: 4,
      avgResponseTime: 2.1
    }
  ]

  // Calculate totals
  const totalEmployers = omanRegions.reduce((sum, region) => sum + region.employers, 0)
  const totalWorkers = kenyaRegions.reduce((sum, region) => sum + region.workers, 0)
  const totalDisputes = omanRegions.reduce((sum, region) => sum + region.disputes, 0)
  const totalCases = omanRegions.reduce((sum, region) => sum + region.cases, 0)
  const totalWhistleBlowing = omanRegions.reduce((sum, region) => sum + region.whistleBlowing, 0) + 
                            kenyaRegions.reduce((sum, region) => sum + region.whistleBlowing, 0)

  return {
    // Real-time operational data - NO REVENUE
    operations: {
      totalWorkers: Math.floor(24567 + Math.sin(timeFactor * 0.1) * 100),
      activeWorkers: Math.floor(18923 + Math.cos(timeFactor * 0.08) * 200),
      activeEmployers: Math.floor(4657 + Math.cos(timeFactor * 0.08) * 50),
      pendingApplications: Math.floor(2345 + Math.sin(timeFactor * 0.12) * 80),
      resolvedIssues: Math.floor(189 + Math.cos(timeFactor * 0.15) * 15),
      criticalIssues: Math.floor(23 + Math.sin(timeFactor * 0.2) * 5),
      newMatchesToday: Math.floor(67 + Math.cos(timeFactor * 0.1) * 10),
      totalDisputes: totalDisputes,
      activeCases: totalCases,
      newRegistrations: Math.floor(145 + Math.sin(timeFactor * 0.25) * 20),
      activePlacements: Math.floor(18923 + Math.sin(timeFactor * 0.18) * 200),
      completedContracts: Math.floor(4567 + Math.cos(timeFactor * 0.22) * 100),
      jobPostings: Math.floor(567 + Math.sin(timeFactor * 0.3) * 50),
      applicationsReceived: Math.floor(2890 + Math.cos(timeFactor * 0.25) * 100),
      applicationsAccepted: Math.floor(756 + Math.sin(timeFactor * 0.2) * 30),
      whistleBlowingCases: totalWhistleBlowing,
      urgentCases: Math.floor(34 + Math.cos(timeFactor * 0.18) * 8),
    },
    performance: {
      placementRate: 92 + Math.sin(timeFactor * 0.2) * 3,
      satisfactionRate: 94 + Math.cos(timeFactor * 0.25) * 2,
      responseTime: Math.floor(45 + Math.sin(timeFactor * 0.3) * 10),
      retentionRate: 88 + Math.sin(timeFactor * 0.15) * 4,
      disputeResolutionRate: 85 + Math.cos(timeFactor * 0.2) * 5,
      caseResolutionRate: 89 + Math.sin(timeFactor * 0.18) * 4,
      employerSatisfaction: 91 + Math.cos(timeFactor * 0.12) * 3,
      workerSatisfaction: 93 + Math.sin(timeFactor * 0.16) * 2,
      applicationToAcceptanceRate: 26.2 + Math.sin(timeFactor * 0.1) * 2,
    },
    regional: {
      oman: omanRegions.map(region => ({
        ...region,
        employerPercentage: ((region.employers / totalEmployers) * 100).toFixed(1),
        disputePercentage: ((region.disputes / totalDisputes) * 100).toFixed(1),
        casePercentage: ((region.cases / totalCases) * 100).toFixed(1),
        acceptanceRate: ((region.accepted / region.applications) * 100).toFixed(1),
      })),
      kenya: kenyaRegions,
    },
    disputes: {
      byType: [
        { type: "Payment Issues", count: 45, percentage: 32.1, trend: "up", resolved: 38 },
        { type: "Contract Terms", count: 38, percentage: 27.1, trend: "stable", resolved: 32 },
        { type: "Working Conditions", count: 28, percentage: 20.0, trend: "down", resolved: 25 },
        { type: "Accommodation", count: 19, percentage: 13.6, trend: "up", resolved: 15 },
        { type: "Documentation", count: 10, percentage: 7.1, trend: "stable", resolved: 8 },
      ],
      resolutionTime: [
        { period: "0-2 days", cases: 56, percentage: 40 },
        { period: "3-5 days", cases: 42, percentage: 30 },
        { period: "6-10 days", cases: 28, percentage: 20 },
        { period: "10+ days", cases: 14, percentage: 10 },
      ],
      bySeverity: [
        { severity: "Critical", count: 23, percentage: 16.4, color: "red" },
        { severity: "High", count: 45, percentage: 32.1, color: "orange" },
        { severity: "Medium", count: 52, percentage: 37.1, color: "yellow" },
        { severity: "Low", count: 20, percentage: 14.3, color: "green" },
      ]
    },
    jobMarket: {
      postingsTrend: [
        { day: "Mon", postings: 45, applications: 234, accepted: 67 },
        { day: "Tue", postings: 52, applications: 289, accepted: 78 },
        { day: "Wed", postings: 38, applications: 198, accepted: 45 },
        { day: "Thu", postings: 61, applications: 345, accepted: 89 },
        { day: "Fri", postings: 49, applications: 267, accepted: 72 },
        { day: "Sat", postings: 23, applications: 123, accepted: 34 },
        { day: "Sun", postings: 18, applications: 89, accepted: 23 },
      ],
      topCategories: [
        { category: "Housekeeping", postings: 156, applications: 892, acceptanceRate: 26.2 },
        { category: "Child Care", postings: 89, applications: 567, acceptanceRate: 31.5 },
        { category: "Elderly Care", postings: 67, applications: 345, acceptanceRate: 28.9 },
        { category: "Cooking", postings: 45, applications: 234, acceptanceRate: 24.8 },
        { category: "Driving", postings: 34, applications: 189, acceptanceRate: 22.8 },
      ]
    },
    registrations: {
      daily: [
        { day: "Mon", employers: 23, workers: 45 },
        { day: "Tue", employers: 34, workers: 56 },
        { day: "Wed", employers: 28, workers: 52 },
        { day: "Thu", employers: 45, workers: 67 },
        { day: "Fri", employers: 38, workers: 61 },
        { day: "Sat", employers: 19, workers: 34 },
        { day: "Sun", employers: 12, workers: 23 },
      ],
      monthlyGrowth: {
        employers: 12.5,
        workers: 15.8,
        applications: 18.3
      },
      sources: [
        { source: "Website", percentage: 45, trend: "up" },
        { source: "Mobile App", percentage: 32, trend: "up" },
        { source: "Agent Referral", percentage: 15, trend: "stable" },
        { source: "Word of Mouth", percentage: 8, trend: "down" },
      ]
    },
    // Live activity simulation
    liveActivity: Array.from({ length: 12 }, (_, i) => ({
      id: `activity-${i}`,
      type: ['new_application', 'placement', 'issue_reported', 'document_uploaded', 'dispute_opened', 'case_resolved', 'whistle_blown', 'job_posted'][Math.floor(Math.random() * 8)],
      region: ['Nairobi', 'Mombasa', 'Muscat', 'Salalah', 'Sohar'][Math.floor(Math.random() * 5)],
      description: `Worker ${Math.floor(1000 + Math.random() * 9000)} ${[
        'applied for job', 'placed with employer', 'reported issue', 'uploaded documents', 
        'opened dispute', 'case resolved', 'reported critical issue', 'job posting created'
      ][Math.floor(Math.random() * 8)]}`,
      time: `${Math.floor(1 + Math.random() * 59)}m ago`,
      priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
    })),
  }
}

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000, className = "" }: { value: number; duration?: number; className?: string }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true)
      const start = displayValue
      const end = value
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        const current = Math.floor(start + (end - start) * progress)
        setDisplayValue(current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [value, duration])

  return (
    <span className={cn(
      "font-mono font-bold",
      isAnimating && "text-blue-400",
      className
    )}>
      {displayValue.toLocaleString()}
    </span>
  )
}

// Network Status Component
const NetworkStatus = () => {
  const [status, setStatus] = useState({
    connected: true,
    strength: "excellent",
    latency: "28ms"
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus({
        connected: Math.random() > 0.1,
        strength: ["excellent", "good", "fair", "poor"][Math.floor(Math.random() * 4)],
        latency: `${Math.floor(20 + Math.random() * 50)}ms`
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-2 py-1 border border-slate-700 text-xs">
      <div className="flex items-center gap-1">
        <Wifi className={cn(
          "h-3 w-3",
          status.connected ? "text-green-400" : "text-red-400"
        )} />
        <Signal className={cn(
          "h-3 w-3",
          status.strength === "excellent" ? "text-green-400" :
          status.strength === "good" ? "text-blue-400" :
          status.strength === "fair" ? "text-yellow-400" : "text-red-400"
        )} />
      </div>
      <div className="text-gray-300">
        {status.connected ? status.latency : "Offline"}
      </div>
    </div>
  )
}

// Simple Bar Chart Component
const SimpleBarChart = ({ data, color = "blue", height = 100 }: { data: any[]; color?: string; height?: number }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500"
  }

  return (
    <div className="flex items-end justify-between gap-1" style={{ height: `${height}px` }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={cn(
              "w-full rounded-t transition-all duration-500 hover:opacity-80",
              colorClasses[color as keyof typeof colorClasses]
            )}
            style={{ height: `${(item.value / maxValue) * 80}%` }}
          />
          <div className="text-xs text-gray-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

// Simple Pie Chart Component
const SimplePieChart = ({ data, size = 100 }: { data: any[]; size?: number }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100
          const angle = (percentage / 100) * 360
          const nextAngle = currentAngle + angle
          
          const largeArc = angle > 180 ? 1 : 0
          const x1 = 50 + 50 * Math.cos(currentAngle * Math.PI / 180)
          const y1 = 50 + 50 * Math.sin(currentAngle * Math.PI / 180)
          const x2 = 50 + 50 * Math.cos(nextAngle * Math.PI / 180)
          const y2 = 50 + 50 * Math.sin(nextAngle * Math.PI / 180)

          const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
          
          const segment = (
            <path
              key={index}
              d={path}
              fill={item.color}
              className="transition-all duration-500 hover:opacity-80"
            />
          )
          
          currentAngle = nextAngle
          return segment
        })}
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center transform rotate-90">
          <div className="text-xs text-gray-400">Total</div>
          <div className="text-sm font-bold text-white">{total}</div>
        </div>
      </div>
    </div>
  )
}

// Stats Card Component
const StatsCard = ({ icon, value, label, trend, percentage, color = "blue", subtitle }: { 
  icon: React.ReactNode; 
  value: number; 
  label: string; 
  trend?: "up" | "down" | "stable";
  percentage?: number;
  color?: string;
  subtitle?: string;
}) => {
  const colorClasses = {
    blue: "border-blue-500/30 bg-blue-500/10",
    green: "border-green-500/30 bg-green-500/10",
    red: "border-red-500/30 bg-red-500/10",
    yellow: "border-yellow-500/30 bg-yellow-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
    orange: "border-orange-500/30 bg-orange-500/10"
  }

  return (
    <Card className={cn("backdrop-blur-sm transition-all duration-300 hover:scale-105", colorClasses[color])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-white/5">
            {icon}
          </div>
          {trend && (
            <div className={cn(
              "p-1 rounded text-xs",
              trend === 'up' ? "bg-green-500/20 text-green-400" :
              trend === 'down' ? "bg-red-500/20 text-red-400" :
              "bg-yellow-500/20 text-yellow-400"
            )}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
               trend === 'down' ? <TrendingDown className="h-3 w-3" /> :
               <TrendingUp className="h-3 w-3" />}
            </div>
          )}
        </div>
        <div className="text-2xl font-bold text-white mb-1">
          <AnimatedCounter value={value} />
        </div>
        <div className="text-sm text-gray-300">{label}</div>
        {subtitle && (
          <div className="text-xs text-blue-400 mt-1">{subtitle}</div>
        )}
        {percentage && (
          <div className={cn(
            "text-xs font-semibold mt-1",
            percentage > 0 ? "text-green-400" : "text-red-400"
          )}>
            {percentage > 0 ? "+" : ""}{percentage}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Enhanced Oman Map Component
const OmanMap = ({ regions, onRegionClick }: { regions: any[], onRegionClick: (region: any) => void }) => {
  return (
    <div className="relative w-full h-48 bg-slate-800/30 rounded-lg border border-slate-600/50">
      <div className="absolute inset-4">
        <div className="w-full h-full bg-slate-700/20 rounded relative">
          {regions.map((region, index) => (
            <button
              key={region.name}
              onClick={() => onRegionClick(region)}
              className={cn(
                "absolute w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-150",
                region.issueRate > 5 ? "border-red-400 bg-red-400/20" :
                region.issueRate > 3 ? "border-yellow-400 bg-yellow-400/20" :
                "border-green-400 bg-green-400/20"
              )}
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y}%`,
              }}
            >
              <div className="absolute -inset-1 animate-ping rounded-full bg-current opacity-20"></div>
            </button>
          ))}
          
          {/* Region labels */}
          {regions.map((region) => (
            <div
              key={region.name}
              className="absolute text-xs text-gray-300 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${region.coordinates.x}%`,
                top: `${region.coordinates.y + 6}%`,
              }}
            >
              {region.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Map legend */}
      <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-300">Low Issues</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-300">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
          <span className="text-gray-300">High Issues</span>
        </div>
      </div>
    </div>
  )
}

// Live Activity Stream Component
const LiveActivityStream = ({ activities }: { activities: any[] }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [activities])

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'new_application': return <UserPlus className="h-4 w-4 text-green-400" />
      case 'placement': return <Briefcase className="h-4 w-4 text-blue-400" />
      case 'issue_reported': return <AlertOctagon className="h-4 w-4 text-red-400" />
      case 'document_uploaded': return <FileText className="h-4 w-4 text-purple-400" />
      case 'dispute_opened': return <GitMerge className="h-4 w-4 text-orange-400" />
      case 'case_resolved': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'whistle_blown': return <Shield className="h-4 w-4 text-red-400" />
      case 'job_posted': return <Target className="h-4 w-4 text-blue-400" />
      default: return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  return (
    <div 
      ref={containerRef}
      className="h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-900/20"
    >
      {activities.map((activity, index) => (
        <div
          key={activity.id}
          className={cn(
            "p-3 rounded-lg border-l-4 transition-all duration-300",
            activity.priority === 'critical' ? 'border-l-red-500 bg-red-500/10' :
            activity.priority === 'high' ? 'border-l-orange-500 bg-orange-500/10' :
            activity.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-500/10' :
            'border-l-green-500 bg-green-500/10'
          )}
        >
          <div className="flex items-start gap-3">
            {getActivityIcon(activity.type)}
            <div className="flex-1">
              <div className="text-sm text-white mb-1">{activity.description}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 text-xs">
                  {activity.region}
                </Badge>
                <span className="text-xs text-gray-400">{activity.time}</span>
                {activity.priority === 'critical' && (
                  <Badge variant="secondary" className="bg-red-500/20 text-red-300 text-xs">
                    Critical
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Percentage Bar Component
const PercentageBar = ({ percentage, color = "blue", label, value }: { 
  percentage: number; 
  color?: string; 
  label: string;
  value?: number;
}) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500"
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-medium">
          {value ? `${value} (${percentage}%)` : `${percentage}%`}
        </span>
      </div>
      <Progress value={percentage} className={cn("h-2 bg-gray-700", colorClasses[color as keyof typeof colorClasses])} />
    </div>
  )
}

export default function KazipertSuperAdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [time, setTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<any>(null)

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Initialize and update data
  useEffect(() => {
    setData(generateKazipertData())
    
    const interval = setInterval(() => {
      if (isPlaying) {
        setData(generateKazipertData())
        setTime(new Date())
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Super Admin Dashboard...</div>
      </div>
    )
  }

  // Enhanced stats data - NO REVENUE
  const employerStats = [
    { 
      icon: <Building2 className="h-5 w-5 text-blue-400" />, 
      value: data.operations.activeEmployers, 
      label: "Active Employers", 
      trend: "up" as const, 
      percentage: 12.5, 
      color: "blue" as const,
      subtitle: "Oman Based"
    },
    { 
      icon: <Target className="h-5 w-5 text-green-400" />, 
      value: data.operations.jobPostings, 
      label: "Active Job Postings", 
      trend: "up" as const, 
      percentage: 8.3, 
      color: "green" as const 
    },
    { 
      icon: <UserCheck className="h-5 w-5 text-purple-400" />, 
      value: data.operations.newMatchesToday, 
      label: "New Matches Today", 
      trend: "up" as const, 
      percentage: 15.7, 
      color: "purple" as const 
    },
    { 
      icon: <Scale className="h-5 w-5 text-red-400" />, 
      value: data.operations.totalDisputes, 
      label: "Active Disputes", 
      trend: "down" as const, 
      percentage: -5.2, 
      color: "red" as const 
    },
  ]

  const employeeStats = [
    { 
      icon: <Users className="h-5 w-5 text-blue-400" />, 
      value: data.operations.totalWorkers, 
      label: "Total Workers", 
      trend: "up" as const, 
      percentage: 15.8, 
      color: "blue" as const,
      subtitle: "Kenya Based"
    },
    { 
      icon: <UserPlus className="h-5 w-5 text-green-400" />, 
      value: data.operations.newRegistrations, 
      label: "New Registrations", 
      trend: "up" as const, 
      percentage: 18.3, 
      color: "green" as const 
    },
    { 
      icon: <Briefcase className="h-5 w-5 text-yellow-400" />, 
      value: data.operations.activePlacements, 
      label: "Active Placements", 
      trend: "up" as const, 
      percentage: 12.1, 
      color: "yellow" as const 
    },
    { 
      icon: <FileText className="h-5 w-5 text-purple-400" />, 
      value: data.operations.pendingApplications, 
      label: "Pending Applications", 
      trend: "stable" as const, 
      percentage: 2.4, 
      color: "purple" as const 
    },
  ]

  const operationalStats = [
    { 
      icon: <GitPullRequest className="h-5 w-5 text-orange-400" />, 
      value: data.operations.applicationsReceived, 
      label: "Applications Received", 
      trend: "up" as const, 
      percentage: 22.3, 
      color: "orange" as const 
    },
    { 
      icon: <CheckCircle className="h-5 w-5 text-green-400" />, 
      value: data.operations.applicationsAccepted, 
      label: "Applications Accepted", 
      trend: "up" as const, 
      percentage: 18.7, 
      color: "green" as const 
    },
    { 
      icon: <Shield className="h-5 w-5 text-red-400" />, 
      value: data.operations.whistleBlowingCases, 
      label: "Whistle-blowing Cases", 
      trend: "down" as const, 
      percentage: -8.2, 
      color: "red" as const 
    },
    { 
      icon: <AlertTriangle className="h-5 w-5 text-yellow-400" />, 
      value: data.operations.urgentCases, 
      label: "Urgent Cases", 
      trend: "stable" as const, 
      percentage: 3.1, 
      color: "yellow" as const 
    },
  ]

  // Chart data - Job Market Trends
  const jobMarketData = data.jobMarket.postingsTrend.map((day: any) => ({
    label: day.day,
    value: day.postings
  }))

  // Dispute severity data for pie chart
  const disputeSeverityData = data.disputes.bySeverity.map((severity: any) => ({
    label: severity.severity,
    value: severity.count,
    color: severity.color === "red" ? "#ef4444" : 
           severity.color === "orange" ? "#f97316" : 
           severity.color === "yellow" ? "#eab308" : "#22c55e"
  }))

  return (
    <div className={cn(
      "min-h-screen text-white p-4 overflow-hidden transition-all duration-300",
      isFullscreen ? "bg-black" : "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    )}>
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 p-4 bg-slate-800/50 rounded-lg border border-blue-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                KAZIPERT DATA CENTER
              </h1>
              <p className="text-sm text-gray-300">Domestic Workers Operations • Kenya & Oman</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            <span className="font-mono text-sm">LIVE OPERATIONS</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xl lg:text-2xl font-mono font-bold text-blue-400">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-300">
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <NetworkStatus />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-blue-500/20 border border-blue-500/30"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setData(generateKazipertData())}
              className="text-white hover:bg-blue-500/20 border border-blue-500/30"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-blue-500/20 border border-blue-500/30"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {employerStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {employeeStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {operationalStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Regional Data */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Oman Map */}
        <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm xl:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Map className="h-5 w-5 text-blue-400" />
              <div className="font-semibold text-white">Oman Employer Distribution</div>
              <div className="flex-1" />
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                {data.regional.oman.length} Regions
              </Badge>
            </div>
            <OmanMap regions={data.regional.oman} onRegionClick={setSelectedRegion} />
            {selectedRegion && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="text-lg font-semibold text-white mb-2">{selectedRegion.name}</div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-blue-400">{selectedRegion.employers} Employers</div>
                  <div className="text-green-400">{selectedRegion.acceptanceRate}% Acceptance</div>
                  <div className="text-red-400">{selectedRegion.whistleBlowing} Critical Cases</div>
                  <div className="text-yellow-400">{selectedRegion.satisfaction}% Satisfaction</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Market Trends */}
        <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur-sm xl:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <BarChart className="h-5 w-5 text-green-400" />
              <div className="font-semibold text-white">Job Postings Trend</div>
              <div className="flex-1" />
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                This Week
              </Badge>
            </div>
            <SimpleBarChart data={jobMarketData} color="green" height={200} />
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{data.operations.jobPostings}</div>
                <div className="text-xs text-gray-400">Active Postings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">{data.operations.applicationsReceived}</div>
                <div className="text-xs text-gray-400">Applications</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{data.operations.applicationsAccepted}</div>
                <div className="text-xs text-gray-400">Accepted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Analysis */}
        <Card className="bg-slate-800/50 border-red-500/30 backdrop-blur-sm xl:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="h-5 w-5 text-red-400" />
              <div className="font-semibold text-white">Dispute Analysis</div>
              <div className="flex-1" />
              <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                {data.performance.disputeResolutionRate}% Resolved
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <SimplePieChart data={disputeSeverityData} size={120} />
              <div className="flex-1 ml-4 space-y-3">
                {data.disputes.bySeverity.map((severity: any) => (
                  <div key={severity.severity} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded" 
                        style={{ 
                          backgroundColor: 
                            severity.color === "red" ? "#ef4444" : 
                            severity.color === "orange" ? "#f97316" : 
                            severity.color === "yellow" ? "#eab308" : "#22c55e"
                        }}
                      />
                      <span className="text-gray-300">{severity.severity}</span>
                    </div>
                    <div className="text-white font-medium">
                      {severity.count} ({severity.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <PercentageBar 
                percentage={data.performance.disputeResolutionRate} 
                color="green" 
                label="Dispute Resolution Rate" 
              />
              <PercentageBar 
                percentage={data.performance.caseResolutionRate} 
                color="blue" 
                label="Case Resolution Rate" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics & Live Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Performance Metrics */}
        <Card className="bg-slate-800/50 border-yellow-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-yellow-400" />
              <div className="font-semibold text-white">Performance Metrics</div>
            </div>
            <div className="space-y-4">
              <PercentageBar percentage={data.performance.placementRate} color="blue" label="Placement Success Rate" />
              <PercentageBar percentage={data.performance.satisfactionRate} color="green" label="Overall Satisfaction Rate" />
              <PercentageBar percentage={data.performance.retentionRate} color="purple" label="Worker Retention Rate" />
              <PercentageBar percentage={data.performance.employerSatisfaction} color="orange" label="Employer Satisfaction" />
              <PercentageBar percentage={data.performance.workerSatisfaction} color="green" label="Worker Satisfaction" />
              <PercentageBar percentage={data.performance.applicationToAcceptanceRate} color="blue" label="Application to Acceptance Rate" />
            </div>
          </CardContent>
        </Card>

        {/* Live Activity Stream */}
        <Card className="bg-slate-800/50 border-blue-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-blue-400 animate-pulse" />
              <div className="font-semibold text-white">Live Operations Activity</div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  {data.liveActivity.filter((act: any) => act.type === 'new_application').length} New Apps
                </Badge>
                <Badge variant="secondary" className="bg-red-500/20 text-red-300">
                  {data.liveActivity.filter((act: any) => act.priority === 'critical').length} Critical
                </Badge>
              </div>
            </div>
            <LiveActivityStream activities={data.liveActivity} />
          </CardContent>
        </Card>
      </div>

      {/* Dispute Types & Job Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Dispute Types */}
        <Card className="bg-slate-800/50 border-orange-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <GitMerge className="h-5 w-5 text-orange-400" />
              <div className="font-semibold text-white">Dispute Types & Resolution</div>
            </div>
            <div className="space-y-4">
              {data.disputes.byType.map((dispute: any) => (
                <div key={dispute.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{dispute.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{dispute.count}</span>
                      <Badge variant="secondary" className={cn(
                        "text-xs",
                        dispute.trend === 'up' ? "bg-red-500/20 text-red-300" :
                        dispute.trend === 'down' ? "bg-green-500/20 text-green-300" :
                        "bg-yellow-500/20 text-yellow-300"
                      )}>
                        {dispute.trend}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{dispute.resolved} resolved</span>
                    <span>{dispute.percentage}% of total</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Categories */}
        <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-5 w-5 text-purple-400" />
              <div className="font-semibold text-white">Job Categories Performance</div>
            </div>
            <div className="space-y-4">
              {data.jobMarket.topCategories.map((category: any) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{category.category}</span>
                    <span className="text-white font-medium">{category.postings} postings</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{category.applications} applications</span>
                    <span className="text-green-400">{category.acceptanceRate}% acceptance</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 space-y-2">
        <div className="flex flex-wrap justify-center items-center gap-3">
          <span className="text-white font-semibold">KAZIPERT SUPER ADMIN DASHBOARD v4.0</span>
          <span>•</span>
          <span>Domestic Workers Kenya → Employers Oman</span>
          <span>•</span>
          <span className="text-green-400 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3">
          <span>Last Updated: {time.toLocaleTimeString()}</span>
          <span>•</span>
          <span>Data refreshes every 3 seconds</span>
          <span>•</span>
          <span>Total Workers: {data.operations.totalWorkers.toLocaleString()}</span>
          <span>•</span>
          <span>Total Employers: {data.operations.activeEmployers.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
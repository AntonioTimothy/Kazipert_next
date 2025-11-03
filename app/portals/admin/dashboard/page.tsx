"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import {
  Users,
  Building,
  AlertTriangle,
  Shield,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageCircle,
  Activity,
  PieChart,
  BarChart3,
  LineChart,
  Globe,
  Heart,
  Plane,
  Phone,
  Mail,
  Video,
  Calendar,
  Zap,
  Crown,
  Target,
  RefreshCw,
  Play,
  Pause,
  Battery,
  Wifi,
  Signal,
  Server,
  Database,
  Cpu,
  Network,
  ShieldCheck,
  Lock,
  Headphones,
  Tv,
  Smartphone,
  Laptop,
  Monitor,
  Download,
  Upload,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  MapPin,
  Eye,
  ArrowUpRight,
  AlertCircle,
  UserCheck,
  Building2,
  PhoneCall,
  MessageSquare,
  CalendarDays
} from "lucide-react"

// Enhanced mock data with real-time simulation
const generateLiveData = () => {
  const baseTime = Date.now()
  const timeFactor = baseTime / 1000
  
  return {
    // Real-time counters with continuous updates
    cases: {
      total: Math.floor(245 + Math.sin(timeFactor * 0.1) * 20),
      resolved: Math.floor(189 + Math.cos(timeFactor * 0.08) * 15),
      pending: Math.floor(45 + Math.sin(timeFactor * 0.12) * 10),
      critical: Math.floor(11 + Math.cos(timeFactor * 0.15) * 5),
      today: Math.floor(34 + Math.sin(timeFactor * 0.2) * 8),
    },
    users: {
      activeEmployees: Math.floor(12457 + Math.sin(timeFactor * 0.05) * 100),
      activeEmployers: Math.floor(2341 + Math.cos(timeFactor * 0.06) * 50),
      onlineNow: Math.floor(892 + Math.sin(timeFactor * 0.2) * 50),
      newToday: Math.floor(67 + Math.cos(timeFactor * 0.1) * 10),
      verifiedToday: Math.floor(45 + Math.sin(timeFactor * 0.15) * 5),
    },
    performance: {
      responseTime: Math.floor(120 + Math.sin(timeFactor * 0.3) * 20),
      uptime: 99.8 + Math.sin(timeFactor * 0.1) * 0.1,
      satisfaction: 94 + Math.cos(timeFactor * 0.2) * 2,
      resolutionRate: 92 + Math.sin(timeFactor * 0.25) * 3,
    },
    financial: {
      revenue: Math.floor(125000 + Math.sin(timeFactor * 0.1) * 5000),
      transactions: Math.floor(2345 + Math.cos(timeFactor * 0.08) * 100),
      pendingPayments: Math.floor(67 + Math.sin(timeFactor * 0.12) * 15),
      commission: Math.floor(12500 + Math.cos(timeFactor * 0.15) * 800),
    },
    // Live chat simulation
    liveChats: Array.from({ length: 12 }, (_, i) => ({
      id: `chat-${i}`,
      user: `User ${String.fromCharCode(65 + i)}`,
      message: `Support request #${Math.floor(1000 + Math.random() * 9000)}`,
      duration: `${Math.floor(1 + Math.random() * 15)}m`,
      status: ['active', 'waiting', 'resolving'][Math.floor(Math.random() * 3)],
      priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      type: ['technical', 'billing', 'general', 'emergency'][Math.floor(Math.random() * 4)],
    })),
    // Real-time graph data
    trafficData: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      value: 50 + Math.sin(i * 0.5 + timeFactor * 0.1) * 30 + Math.random() * 20,
    })),
    incidentTrend: Array.from({ length: 12 }, (_, i) => ({
      month: i,
      incidents: 20 + Math.sin(i * 0.8 + timeFactor * 0.05) * 15 + Math.random() * 10,
      resolved: 18 + Math.cos(i * 0.7 + timeFactor * 0.05) * 12 + Math.random() * 8,
    })),
    regionalData: [
      { region: "Muscat", workers: 6543, active: 5123, growth: 12.5 },
      { region: "Salalah", workers: 2341, active: 1872, growth: 8.3 },
      { region: "Sohar", workers: 1567, active: 1245, growth: 15.2 },
      { region: "Nizwa", workers: 892, active: 712, growth: 6.7 },
    ],
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
      isAnimating && "text-green-400",
      className
    )}>
      {displayValue.toLocaleString()}
    </span>
  )
}

// Live Graph Components
const LiveLineGraph = ({ data, color = "#10b981", height = 60 }: { data: any[]; color?: string; height?: number }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current
      const length = path.getTotalLength()
      
      path.style.strokeDasharray = length.toString()
      path.style.strokeDashoffset = length.toString()
      
      const animation = path.animate([
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ], {
        duration: 2000,
        easing: "ease-in-out",
        fill: "forwards"
      })
      
      return () => animation.cancel()
    }
  }, [data])

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 ${data.length * 10} 40`} className="w-full h-full">
        <path
          ref={pathRef}
          d={data.map((point, i) => 
            `${i === 0 ? 'M' : 'L'} ${i * 10} ${40 - (point.value / maxValue) * 40}`
          ).join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
        {data.map((point, i) => (
          <circle
            key={i}
            cx={i * 10}
            cy={40 - (point.value / maxValue) * 40}
            r="1.5"
            fill={color}
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  )
}

const AnimatedBarChart = ({ data, colors = ["#10b981", "#3b82f6"] }: { data: any[]; colors?: string[] }) => {
  return (
    <div className="flex items-end justify-between h-16 gap-1 px-2">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex-1 rounded-t transition-all duration-1000 ease-out hover:opacity-80"
          style={{ 
            height: `${(item.value / 100) * 100}%`,
            background: `linear-gradient(to top, ${colors[0]}, ${colors[1]})`,
            animation: `pulse 2s infinite ${index * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

// Rotating Stats Component
const RotatingStats = ({ stats, interval = 5000 }: { stats: any[]; interval?: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stats.length)
    }, interval)
    return () => clearInterval(timer)
  }, [stats.length, interval])

  return (
    <div className="h-20 overflow-hidden relative">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            index === currentIndex 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          )}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              <AnimatedCounter value={stat.value} />
            </div>
            <div className="text-sm text-gray-300">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Live Chat Stream Component
const LiveChatStream = ({ chats }: { chats: any[] }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chats])

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'emergency': return 'red'
      case 'technical': return 'blue'
      case 'billing': return 'purple'
      default: return 'green'
    }
  }

  return (
    <div 
      ref={chatContainerRef}
      className="h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-green-900/20"
    >
      {chats.map((chat, index) => (
        <div
          key={chat.id}
          className={cn(
            "p-3 rounded-lg border-l-4 transition-all duration-300 animate-in slide-in-from-right",
            chat.priority === 'high' ? 'border-l-red-500 bg-red-500/10' :
            chat.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-500/10' :
            'border-l-green-500 bg-green-500/10'
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-semibold text-white text-sm">{chat.user}</div>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    `bg-${getTypeColor(chat.type)}-500/20 text-${getTypeColor(chat.type)}-300`
                  )}
                >
                  {chat.type}
                </Badge>
              </div>
              <div className="text-gray-300 text-xs">{chat.message}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs",
                  chat.status === 'active' && "bg-green-500/20 text-green-300",
                  chat.status === 'waiting' && "bg-yellow-500/20 text-yellow-300",
                  chat.status === 'resolving' && "bg-blue-500/20 text-blue-300"
                )}
              >
                {chat.status}
              </Badge>
              <div className="text-xs text-gray-400">{chat.duration}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// System Status Component
const SystemStatus = () => {
  const [systems, setSystems] = useState([
    { name: "API Gateway", status: "operational", latency: "45ms" },
    { name: "Database", status: "operational", latency: "12ms" },
    { name: "Cache", status: "operational", latency: "8ms" },
    { name: "File Storage", status: "operational", latency: "23ms" },
    { name: "Message Queue", status: "operational", latency: "34ms" },
    { name: "Payment Gateway", status: "operational", latency: "67ms" },
    { name: "Auth Service", status: "operational", latency: "15ms" },
    { name: "Notification", status: "operational", latency: "28ms" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setSystems(prev => prev.map(sys => ({
        ...sys,
        latency: `${Math.floor(5 + Math.random() * 80)}ms`,
        status: Math.random() > 0.95 ? "degraded" : "operational"
      })))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-4 gap-2">
      {systems.map((system, index) => (
        <div
          key={system.name}
          className={cn(
            "p-2 rounded text-center transition-all duration-500 border",
            system.status === 'operational' 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-yellow-500/10 border-yellow-500/30 animate-pulse'
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="text-xs text-white font-medium truncate">{system.name}</div>
          <div className="text-[10px] text-gray-400">{system.latency}</div>
          <div className={cn(
            "text-[10px] font-bold mt-1",
            system.status === 'operational' ? 'text-green-400' : 'text-yellow-400'
          )}>
            {system.status.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  )
}

// Regional Distribution Component
const RegionalDistribution = ({ data }: { data: any[] }) => {
  return (
    <div className="space-y-3">
      {data.map((region, index) => (
        <div key={region.region} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-green-400" />
              <span className="text-sm font-medium text-white">{region.region}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-gray-300">{region.workers.toLocaleString()} workers</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                +{region.growth}%
              </Badge>
            </div>
          </div>
          <Progress 
            value={(region.active / region.workers) * 100} 
            className="h-1 bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{region.active.toLocaleString()} active</span>
            <span>{Math.round((region.active / region.workers) * 100)}% active rate</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TVCallCenterDashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [time, setTime] = useState(new Date())
  const [isPlaying, setIsPlaying] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

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
    setData(generateLiveData())
    
    const interval = setInterval(() => {
      if (isPlaying) {
        setData(generateLiveData())
        setTime(new Date())
      }
    }, 2000)

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

  // Rotating stats for the main display
  const rotatingStats = [
    { value: data?.cases.total || 0, label: "Total Cases Today" },
    { value: data?.users.onlineNow || 0, label: "Users Online Now" },
    { value: data?.performance.responseTime || 0, label: "Avg Response Time" },
    { value: data?.users.newToday || 0, label: "New Users Today" },
    { value: data?.financial.transactions || 0, label: "Transactions Today" },
  ]

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-2xl animate-pulse">Loading Dashboard...</div>
      </div>
    )
  }

  return (
    <div className={cn(
      "min-h-screen text-white p-4 overflow-hidden transition-all duration-300",
      isFullscreen ? "bg-gray-900" : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    )}>
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-800/50 rounded-lg border border-green-500/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-green-400 animate-pulse" />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                KAZIPERT SERVICE CENTER
              </h1>
              <p className="text-sm text-gray-300">Real-time Monitoring & Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
            <span className="font-mono text-sm">LIVE DATA STREAM</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-green-400">
              {time.toLocaleTimeString()}
            </div>
            <div className="text-sm text-gray-300">
              {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-green-400">
              <Wifi className="h-4 w-4" />
              <Signal className="h-4 w-4" />
              <Battery className="h-4 w-4" />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-green-500/20 border border-green-500/30"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setData(generateLiveData())}
              className="text-white hover:bg-green-500/20 border border-green-500/30"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-green-500/20 border border-green-500/30"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        {/* Left Column - Core Metrics */}
        <div className="col-span-8 grid grid-rows-2 gap-4">
          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Cases */}
            <Card className="bg-gray-800/50 border-green-500/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <FileText className="h-6 w-6 text-green-400" />
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={data.cases.total} />
                </div>
                <div className="text-sm text-gray-300">Total Cases</div>
                <LiveLineGraph data={data.trafficData} color="#10b981" height={40} />
              </CardContent>
            </Card>

            {/* Resolved Cases */}
            <Card className="bg-gray-800/50 border-green-500/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <div className="text-green-400">✓</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={data.cases.resolved} />
                </div>
                <div className="text-sm text-gray-300">Resolved</div>
                <div className="text-xs text-green-400 mt-1 font-semibold">
                  {Math.round((data.cases.resolved / data.cases.total) * 100)}% Success Rate
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card className="bg-gray-800/50 border-blue-500/30 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-6 w-6 text-blue-400" />
                  <Activity className="h-4 w-4 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  <AnimatedCounter value={data.users.onlineNow} />
                </div>
                <div className="text-sm text-gray-300">Online Now</div>
                <div className="text-xs text-blue-400 mt-1">
                  {data.users.activeEmployees.toLocaleString()} total employees
                </div>
              </CardContent>
            </Card>

            {/* Revenue */}
            <Card className="bg-gray-800/50 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="h-6 w-6 text-purple-400" />
                  <div className="text-purple-400">💰</div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  ${<AnimatedCounter value={data.financial.revenue} />}
                </div>
                <div className="text-sm text-gray-300">Revenue Today</div>
                <div className="text-xs text-purple-400 mt-1">
                  {data.financial.transactions} transactions
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Detailed Analytics */}
          <div className="grid grid-cols-3 gap-4">
            {/* Performance Metrics */}
            <Card className="bg-gray-800/50 border-green-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-green-400" />
                  <div className="font-semibold text-white">System Performance</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Response Time</span>
                      <span className="text-white font-mono">{data.performance.responseTime}ms</span>
                    </div>
                    <Progress value={95} className="h-2 bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Uptime</span>
                      <span className="text-white font-mono">{data.performance.uptime.toFixed(1)}%</span>
                    </div>
                    <Progress value={data.performance.uptime} className="h-2 bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Satisfaction</span>
                      <span className="text-white font-mono">{data.performance.satisfaction}%</span>
                    </div>
                    <Progress value={data.performance.satisfaction} className="h-2 bg-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Statistics */}
            <Card className="bg-gray-800/50 border-blue-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div className="font-semibold text-white">User Analytics</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-xl font-bold text-white">
                      <AnimatedCounter value={data.users.activeEmployees} />
                    </div>
                    <div className="text-xs text-blue-300">Employees</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-xl font-bold text-white">
                      <AnimatedCounter value={data.users.activeEmployers} />
                    </div>
                    <div className="text-xs text-green-300">Employers</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-xl font-bold text-white">
                      <AnimatedCounter value={data.users.newToday} />
                    </div>
                    <div className="text-xs text-purple-300">New Today</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="text-xl font-bold text-white">
                      <AnimatedCounter value={data.users.verifiedToday} />
                    </div>
                    <div className="text-xs text-yellow-300">Verified</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regional Distribution */}
            <Card className="bg-gray-800/50 border-emerald-500/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5 text-emerald-400" />
                  <div className="font-semibold text-white">Regional Distribution</div>
                </div>
                <RegionalDistribution data={data.regionalData} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Live Data & Status */}
        <div className="col-span-4 space-y-4">
          {/* Rotating Stats */}
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <RotatingStats stats={rotatingStats} />
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="bg-gray-800/50 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Server className="h-5 w-5 text-green-400" />
                <div className="font-semibold text-white">System Status</div>
                <div className="flex-1" />
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  All Systems Go
                </Badge>
              </div>
              <SystemStatus />
            </CardContent>
          </Card>

          {/* Incident Trend */}
          <Card className="bg-gray-800/50 border-orange-500/30 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-5 w-5 text-orange-400" />
                <div className="font-semibold text-white">Incident Trend</div>
              </div>
              <AnimatedBarChart data={data.incidentTrend.map((d: any) => ({ value: d.incidents }))} 
                colors={["#f59e0b", "#f97316"]} />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Last 12 months</span>
                <span>Trending: {data.incidentTrend[data.incidentTrend.length - 1].incidents} incidents</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Live Operations */}
      <div className="grid grid-cols-12 gap-4">
        {/* Live Chat Stream */}
        <Card className="col-span-8 bg-gray-800/50 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-green-400 animate-pulse" />
              <div className="font-semibold text-white">Live Support Operations</div>
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  {data.liveChats.filter((chat: any) => chat.status === 'active').length} Active
                </Badge>
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                  {data.liveChats.filter((chat: any) => chat.status === 'waiting').length} Waiting
                </Badge>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                  {data.liveChats.filter((chat: any) => chat.status === 'resolving').length} Resolving
                </Badge>
              </div>
            </div>
            <LiveChatStream chats={data.liveChats} />
          </CardContent>
        </Card>

        {/* Quick Stats & Actions */}
        <Card className="col-span-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 border-green-500/30 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Headphones className="h-5 w-5 text-green-400" />
              <div className="font-semibold text-white">Operations Center</div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <PhoneCall className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">24</div>
                  <div className="text-xs text-green-300">Active Calls</div>
                </div>
                <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <MessageSquare className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">18</div>
                  <div className="text-xs text-blue-300">Chat Sessions</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-gray-300">Avg Wait Time</span>
                  <span className="text-white font-bold">2:34</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-gray-300">Resolved Today</span>
                  <span className="text-white font-bold">156</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                  <span className="text-sm text-gray-300">SLA Compliance</span>
                  <span className="text-green-400 font-bold">98.7%</span>
                </div>
              </div>

              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                <Eye className="h-4 w-4 mr-2" />
                View Detailed Reports
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-4 text-center text-xs text-gray-400">
        KAZIPERT Monitoring System v2.1 • Real-time Dashboard • Last Updated: {time.toLocaleTimeString()} • 
        <span className="text-green-400 ml-2">ALL SYSTEMS OPERATIONAL</span>
        <span className="mx-2">•</span>
        <span>Data refreshes every 2 seconds</span>
      </div>
    </div>
  )
}
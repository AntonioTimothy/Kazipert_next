import {
    Home,
    Briefcase,
    FileText,
    CreditCard,
    Shield,
    Video,
    Star,
    MessageSquare,
    Users,
    Building,
    BarChart3,
    Settings,
    UserCheck,
    Wallet,
    Calendar,
    FolderOpen,
    Heart,
    BookOpen,
    Bell,
    Cog,
    Lock,
    Database,
    AlertTriangle,
    TrendingUp,
    PieChart,
    Monitor,
    Phone,
    Calculator,
    Receipt,
    Banknote,
    Scale,
    FileSearch,
    ClipboardList,
    Target,
    Headphones,
    LineChart,
    DollarSign,
    UserCog,
    Clock,
    Award,
    ShieldCheck,
    Zap,
    Globe,
    Mail,
    Activity
} from "lucide-react"

export type NavigationItem = {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    roles: ("employee" | "employer" | "admin")[]
    permissions?: string[]
    badge?: string
    children?: NavigationItem[]
}

export const navigationConfig: NavigationItem[] = [
    // Worker Navigation - Updated to portals structure
    {
        name: "Home",
        href: "/portals/worker/dashboard",
        icon: Home,
        roles: ["employee"]
    },
    {
        name: "Jobs",
        href: "/portals/worker/jobs",
        icon: Briefcase,
        roles: ["employee"]
    },
   
    {
        name: "Wallet",
        href: "/portals/worker/wallet",
        icon: CreditCard,
        roles: ["employee"]
    },
    {
        name: "Tickets",
        href: "/portals/worker/support",
        icon: MessageSquare,
        roles: ["employee"],
        badge: "3"
    },
    {
        name: "Classes",
        href: "/portals/worker/training",
        icon: Video,
        roles: ["employee"]
    },
    {
        name: "Services",
        href: "/portals/worker/services",
        icon: Shield,
        roles: ["employee"]
    },

    {
        name: "Settings",
        href: "/portals/worker/settings",
        icon: Settings,
        roles: ["employee"]
    },
    
    

    // Employer Navigation - Updated to portals structure
    {
        name: "Home",
        href: "/portals/employer/dashboard",
        icon: Home,
        roles: ["employer"]
    },
    {
        name: "Post Job",
        href: "/portals/employer/jobs/create",
        icon: Briefcase,
        roles: ["employer"]
    },
    {
        name: "My Jobs",
        href: "/portals/employer/jobs",
        icon: FolderOpen,
        roles: ["employer"],
        badge: "5"
    },
    {
        name: "Candidates",
        href: "/portals/employer/candidates",
        icon: Users,
        roles: ["employer"]
    },
    {
        name: "Interviews",
        href: "/portals/employer/interviews",
        icon: Calendar,
        roles: ["employer"],
        badge: "2"
    },
    {
        name: "Company Profile",
        href: "/portals/employer/profile",
        icon: Building,
        roles: ["employer"]
    },
    {
        name: "Billing",
        href: "/portals/employer/billing",
        icon: CreditCard,
        roles: ["employer"]
    },
    {
        name: "Support",
        href: "/portals/employer/support",
        icon: MessageSquare,
        roles: ["employer"]
    },
    {
        name: "Reports",
        href: "/portals/employer/reports",
        icon: BarChart3,
        roles: ["employer"]
    },

    // Admin Navigation - Updated to portals structure
    {
        name: "Dashboard",
        href: "/portals/admin/dashboard",
        icon: Home,
        roles: ["admin"],
        permissions: ["view_dashboard"]
    },

    // Cases Management
    {
        name: "Cases",
        href: "/portals/admin/cases",
        icon: FileSearch,
        roles: ["admin"],
        permissions: ["manage_cases"],
        badge: "12",
        children: [
            {
                name: "All Cases",
                href: "/portals/admin/cases",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_cases"]
            },
            {
                name: "Worker Reports",
                href: "/portals/admin/cases/worker-reports",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_worker_cases"],
                badge: "8"
            },
            {
                name: "Employer Reports",
                href: "/portals/admin/cases/employer-reports",
                icon: Building,
                roles: ["admin"],
                permissions: ["view_employer_cases"],
                badge: "4"
            },
            {
                name: "Dispute Resolution",
                href: "/portals/admin/cases/disputes",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_disputes"],
                badge: "3"
            },
            {
                name: "Case Analytics",
                href: "/portals/admin/cases/analytics",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_case_analytics"]
            }
        ]
    },

    // User Management
    {
        name: "User Management",
        href: "/portals/admin/users",
        icon: Users,
        roles: ["admin"],
        permissions: ["manage_users"],
        children: [
            {
                name: "All Workers",
                href: "/portals/admin/workers",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_workers"]
            },
            {
                name: "All Employers",
                href: "/portals/admin/employers",
                icon: Building,
                roles: ["admin"],
                permissions: ["view_employers"]
            },
            {
                name: "Pending Verification",
                href: "/portals/admin/users/pending",
                icon: UserCheck,
                roles: ["admin"],
                permissions: ["verify_users"],
                badge: "15"
            },
            {
                name: "Suspended Accounts",
                href: "/portals/admin/users/suspended",
                icon: ShieldCheck,
                roles: ["admin"],
                permissions: ["manage_users"],
                badge: "2"
            },
            {
                name: "User Activity",
                href: "/portals/admin/users/activity",
                icon: Activity,
                roles: ["admin"],
                permissions: ["view_user_activity"]
            }
        ]
    },

    // Finance & Accounting
    {
        name: "Finance",
        href: "/portals/admin/finance",
        icon: DollarSign,
        roles: ["admin"],
        permissions: ["manage_finance"],
        children: [
            {
                name: "Financial Dashboard",
                href: "/portals/admin/finance/dashboard",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_finance"]
            },
            {
                name: "Revenue & Profit",
                href: "/portals/admin/finance/revenue",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_revenue"],
                badge: "New"
            },
            {
                name: "Expenses",
                href: "/portals/admin/finance/expenses",
                icon: Receipt,
                roles: ["admin"],
                permissions: ["manage_expenses"]
            },
            {
                name: "Transactions",
                href: "/portals/admin/finance/transactions",
                icon: CreditCard,
                roles: ["admin"],
                permissions: ["view_transactions"]
            },
            {
                name: "Invoicing",
                href: "/portals/admin/finance/invoices",
                icon: FileText,
                roles: ["admin"],
                permissions: ["manage_invoices"],
                badge: "5"
            },
            {
                name: "Tax Management",
                href: "/portals/admin/finance/taxes",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["manage_taxes"]
            },
            {
                name: "Financial Reports",
                href: "/portals/admin/finance/reports",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_financial_reports"]
            },
            {
                name: "Payment Gateway",
                href: "/portals/admin/finance/payments",
                icon: Banknote,
                roles: ["admin"],
                permissions: ["manage_payments"]
            }
        ]
    },

    // HR & Payroll Management
    {
        name: "Human Resources",
        href: "/portals/admin/hr",
        icon: UserCog,
        roles: ["admin"],
        permissions: ["manage_hr"],
        children: [
            {
                name: "Employee Directory",
                href: "/portals/admin/hr/employees",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_employees"]
            },
            {
                name: "Payroll Processing",
                href: "/portals/admin/hr/payroll",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["process_payroll"],
                badge: "Due"
            },
            {
                name: "Salary Structure",
                href: "/portals/admin/hr/salaries",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["manage_salaries"]
            },
            {
                name: "Tax & Deductions",
                href: "/portals/admin/hr/tax-deductions",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_tax_deductions"]
            },
            {
                name: "Attendance",
                href: "/portals/admin/hr/attendance",
                icon: Clock,
                roles: ["admin"],
                permissions: ["view_attendance"]
            },
            {
                name: "Performance Reviews",
                href: "/portals/admin/hr/performance",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_performance"]
            },
            {
                name: "HR Analytics",
                href: "/portals/admin/hr/analytics",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_hr_analytics"]
            }
        ]
    },

    // Analytics & Business Intelligence
    {
        name: "Analytics",
        href: "/portals/admin/analytics",
        icon: BarChart3,
        roles: ["admin"],
        permissions: ["view_analytics"],
        children: [
            {
                name: "Business Overview",
                href: "/portals/admin/analytics/overview",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_business_analytics"]
            },
            {
                name: "Financial Performance",
                href: "/portals/admin/analytics/financial",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["view_financial_analytics"]
            },
            {
                name: "User Analytics",
                href: "/portals/admin/analytics/users",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_user_analytics"]
            },
            {
                name: "Call Center Dashboard",
                href: "/portals/admin/analytics/call-center",
                icon: Headphones,
                roles: ["admin"],
                permissions: ["view_call_analytics"]
            },
            {
                name: "Distress Analytics",
                href: "/portals/admin/analytics/distress",
                icon: AlertTriangle,
                roles: ["admin"],
                permissions: ["view_distress_analytics"],
                badge: "Live"
            },
            {
                name: "Platform Performance",
                href: "/portals/admin/analytics/performance",
                icon: Zap,
                roles: ["admin"],
                permissions: ["view_performance_metrics"]
            },
            {
                name: "Geographic Analytics",
                href: "/portals/admin/analytics/geographic",
                icon: Globe,
                roles: ["admin"],
                permissions: ["view_geo_analytics"]
            },
            {
                name: "Custom Reports",
                href: "/portals/admin/analytics/custom",
                icon: LineChart,
                roles: ["admin"],
                permissions: ["create_custom_reports"]
            }
        ]
    },

    // Job & Contract Management
    {
        name: "Jobs & Contracts",
        href: "/portals/admin/jobs",
        icon: Briefcase,
        roles: ["admin"],
        permissions: ["manage_jobs"],
        children: [
            {
                name: "All Jobs",
                href: "/portals/admin/jobs",
                icon: FolderOpen,
                roles: ["admin"],
                permissions: ["view_jobs"]
            },
            {
                name: "Active Contracts",
                href: "/portals/admin/contracts/active",
                icon: FileText,
                roles: ["admin"],
                permissions: ["view_contracts"],
                badge: "45"
            },
            {
                name: "Contract History",
                href: "/portals/admin/contracts/history",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_contract_history"]
            },
            {
                name: "Job Categories",
                href: "/portals/admin/jobs/categories",
                icon: Target,
                roles: ["admin"],
                permissions: ["manage_categories"]
            },
            {
                name: "Skills Management",
                href: "/portals/admin/jobs/skills",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_skills"]
            }
        ]
    },

    // Services & Training
    {
        name: "Services",
        href: "/portals/admin/services",
        icon: Shield,
        roles: ["admin"],
        permissions: ["manage_services"],
        children: [
            {
                name: "Service Catalog",
                href: "/portals/admin/services",
                icon: Shield,
                roles: ["admin"],
                permissions: ["view_services"]
            },
            {
                name: "Training Programs",
                href: "/portals/admin/services/training",
                icon: Video,
                roles: ["admin"],
                permissions: ["manage_training"]
            },
            {
                name: "Certifications",
                href: "/portals/admin/services/certifications",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_certifications"]
            },
            {
                name: "Service Analytics",
                href: "/portals/admin/services/analytics",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_service_analytics"]
            }
        ]
    },

    // Support & Communication
    {
        name: "Support Center",
        href: "/portals/admin/support",
        icon: Headphones,
        roles: ["admin"],
        permissions: ["manage_support"],
        badge: "23",
        children: [
            {
                name: "Support Tickets",
                href: "/portals/admin/support/tickets",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["view_support_tickets"],
                badge: "18"
            },
            {
                name: "Live Chat",
                href: "/portals/admin/support/chat",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["manage_live_chat"],
                badge: "5"
            },
            {
                name: "Email Support",
                href: "/portals/admin/support/email",
                icon: Mail,
                roles: ["admin"],
                permissions: ["manage_email_support"]
            },
            {
                name: "Call Center",
                href: "/portals/admin/support/calls",
                icon: Phone,
                roles: ["admin"],
                permissions: ["view_call_center"]
            },
            {
                name: "Knowledge Base",
                href: "/portals/admin/support/knowledge",
                icon: BookOpen,
                roles: ["admin"],
                permissions: ["manage_knowledge_base"]
            }
        ]
    },

    // System & Settings
    {
        name: "System",
        href: "/portals/admin/system",
        icon: Settings,
        roles: ["admin"],
        permissions: ["manage_system"],
        children: [
            {
                name: "General Settings",
                href: "/portals/admin/settings/general",
                icon: Cog,
                roles: ["admin"],
                permissions: ["manage_settings"]
            },
            {
                name: "Security",
                href: "/portals/admin/settings/security",
                icon: Lock,
                roles: ["admin"],
                permissions: ["manage_security"]
            },
            {
                name: "Notifications",
                href: "/portals/admin/settings/notifications",
                icon: Bell,
                roles: ["admin"],
                permissions: ["manage_notifications"]
            },
            {
                name: "Database Management",
                href: "/portals/admin/settings/database",
                icon: Database,
                roles: ["admin"],
                permissions: ["manage_database"]
            },
            {
                name: "API Management",
                href: "/portals/admin/settings/api",
                icon: Zap,
                roles: ["admin"],
                permissions: ["manage_api"]
            },
            {
                name: "Backup & Recovery",
                href: "/portals/admin/settings/backup",
                icon: ShieldCheck,
                roles: ["admin"],
                permissions: ["manage_backup"]
            }
        ]
    }
]

// Create a dummy permission set that includes all possible permissions
const getAllAdminPermissions = (): string[] => {
    const allPermissions = new Set<string>()

    navigationConfig.forEach(item => {
        if (item.roles.includes("admin") && item.permissions) {
            item.permissions.forEach(permission => allPermissions.add(permission))
        }
        if (item.children) {
            item.children.forEach(child => {
                if (child.roles.includes("admin") && child.permissions) {
                    child.permissions.forEach(permission => allPermissions.add(permission))
                }
            })
        }
    })

    return Array.from(allPermissions)
}

const ALL_ADMIN_PERMISSIONS = getAllAdminPermissions()

// Helper function to get navigation for a specific role
export function getNavigationForRole(role: "employee" | "employer" | "admin", userPermissions: string[] = []) {
    // If user has no permissions and is admin, use dummy permissions with all access
    const effectivePermissions = role === "admin" && userPermissions.length === 0
        ? ALL_ADMIN_PERMISSIONS
        : userPermissions

    const filteredNavigation = navigationConfig.filter(item =>
        item.roles.includes(role) &&
        (!item.permissions || item.permissions.some(permission => effectivePermissions.includes(permission)))
    )

    console.log(`🔧 getNavigationForRole: role=${role}, permissions=`, effectivePermissions)
    console.log(`📋 Filtered navigation for ${role}:`, filteredNavigation.map(item => item.name))

    return filteredNavigation
}

// Helper function to check if user has access to a route
export function hasAccessToRoute(pathname: string, role: string, userPermissions: string[] = []) {
    // Allow access to auth routes for all users
    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
    if (authRoutes.includes(pathname)) {
        return true
    }

    // If user has no permissions and is admin, use dummy permissions with all access
    const effectivePermissions = role === "admin" && userPermissions.length === 0
        ? ALL_ADMIN_PERMISSIONS
        : userPermissions

    const route = navigationConfig.find(item =>
        item.href === pathname ||
        item.children?.some(child => child.href === pathname)
    )

    console.log(`🔐 hasAccessToRoute: pathname=${pathname}, role=${role}, permissions=`, effectivePermissions)
    console.log(`📍 Found route:`, route)

    if (!route) {
        console.log(`❌ No route found for ${pathname}`)
        return false
    }
    if (!route.roles.includes(role as any)) {
        console.log(`❌ Role mismatch: route requires ${route.roles}, user has ${role}`)
        return false
    }
    if (route.permissions && !route.permissions.some(p => effectivePermissions.includes(p))) {
        console.log(`❌ Permission mismatch: route requires ${route.permissions}, user has`, effectivePermissions)
        return false
    }

    console.log(`✅ Access granted to ${pathname}`)
    return true
}

// Helper function to get flat navigation (for mobile)
export function getFlatNavigation(role: "worker" | "employer" | "admin", userPermissions: string[] = []) {
    // If user has no permissions and is admin, use dummy permissions with all access
    const effectivePermissions = role === "admin" && userPermissions.length === 0
        ? ALL_ADMIN_PERMISSIONS
        : userPermissions

    const navigation = getNavigationForRole(role, effectivePermissions)
    const flatNav: NavigationItem[] = []

    navigation.forEach(item => {
        flatNav.push(item)
        if (item.children) {
            flatNav.push(...item.children)
        }
    })

    return flatNav
}

// Helper function to find navigation item by path
export function findNavigationItemByPath(pathname: string) {
    for (const item of navigationConfig) {
        if (item.href === pathname) {
            return item
        }
        if (item.children) {
            const childItem = item.children.find(child => child.href === pathname)
            if (childItem) {
                return childItem
            }
        }
    }
    return null
}

// Helper function to get breadcrumb path
export function getBreadcrumbForPath(pathname: string): { name: string; href: string }[] {
    const breadcrumbs: { name: string; href: string }[] = []

    for (const item of navigationConfig) {
        if (item.href === pathname) {
            breadcrumbs.push({ name: item.name, href: item.href })
            break
        }
        if (item.children) {
            const childItem = item.children.find(child => child.href === pathname)
            if (childItem) {
                breadcrumbs.push({ name: item.name, href: item.href })
                breadcrumbs.push({ name: childItem.name, href: childItem.href })
                break
            }
        }
    }

    return breadcrumbs
}
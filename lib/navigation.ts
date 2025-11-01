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
    Activity // Using the actual Activity icon from lucide-react
} from "lucide-react"

export type NavigationItem = {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    roles: ("worker" | "employer" | "admin")[]
    permissions?: string[]
    badge?: string
    children?: NavigationItem[]
}

export const navigationConfig: NavigationItem[] = [
    // Worker Navigation
    {
        name: "Home",
        href: "/worker/dashboard",
        icon: Home,
        roles: ["worker"]
    },
    {
        name: "Jobs",
        href: "/worker/jobs",
        icon: Briefcase,
        roles: ["worker"]
    },
   
    {
        name: "Wallet",
        href: "/worker/wallet",
        icon: CreditCard,
        roles: ["worker"]
    },
    {
        name: "Services",
        href: "/worker/services",
        icon: Shield,
        roles: ["worker"]
    },
    {
        name: "Classes",
        href: "/worker/training",
        icon: Video,
        roles: ["worker"]
    },
    // {
    //     name: "Reviews",
    //     href: "/worker/reviews",
    //     icon: Star,
    //     roles: ["worker"]
    // },
    {
        name: "Messages",
        href: "/worker/support",
        icon: MessageSquare,
        roles: ["worker"]
    },

    // Employer Navigation
    {
        name: "Home",
        href: "/employer/dashboard",
        icon: Home,
        roles: ["employer"]
    },
    {
        name: "Post Job",
        href: "/employer/jobs/create",
        icon: Briefcase,
        roles: ["employer"]
    },
    {
        name: "My Jobs",
        href: "/employer/jobs",
        icon: FolderOpen,
        roles: ["employer"],
        badge: "5"
    },
    {
        name: "Candidates",
        href: "/employer/candidates",
        icon: Users,
        roles: ["employer"]
    },
    {
        name: "Interviews",
        href: "/employer/interviews",
        icon: Calendar,
        roles: ["employer"],
        badge: "2"
    },
    {
        name: "Company Profile",
        href: "/employer/profile",
        icon: Building,
        roles: ["employer"]
    },
    {
        name: "Billing",
        href: "/employer/billing",
        icon: CreditCard,
        roles: ["employer"]
    },
    {
        name: "Support",
        href: "/employer/support",
        icon: MessageSquare,
        roles: ["employer"]
    },
    {
        name: "Reports",
        href: "/employer/reports",
        icon: BarChart3,
        roles: ["employer"]
    },

    // Admin Navigation - COMPREHENSIVE UPDATED MENU
    {
        name: "Dashboard",
        href: "/admin/dashboard",
        icon: Home,
        roles: ["admin"],
        permissions: ["view_dashboard"]
    },

    // Cases Management
    {
        name: "Cases",
        href: "/admin/cases",
        icon: FileSearch,
        roles: ["admin"],
        permissions: ["manage_cases"],
        badge: "12",
        children: [
            {
                name: "All Cases",
                href: "/admin/cases",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_cases"]
            },
            {
                name: "Worker Reports",
                href: "/admin/cases/worker-reports",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_worker_cases"],
                badge: "8"
            },
            {
                name: "Employer Reports",
                href: "/admin/cases/employer-reports",
                icon: Building,
                roles: ["admin"],
                permissions: ["view_employer_cases"],
                badge: "4"
            },
            {
                name: "Dispute Resolution",
                href: "/admin/cases/disputes",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_disputes"],
                badge: "3"
            },
            {
                name: "Case Analytics",
                href: "/admin/cases/analytics",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_case_analytics"]
            }
        ]
    },

    // User Management
    {
        name: "User Management",
        href: "/admin/users",
        icon: Users,
        roles: ["admin"],
        permissions: ["manage_users"],
        children: [
            {
                name: "All Workers",
                href: "/admin/workers",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_workers"]
            },
            {
                name: "All Employers",
                href: "/admin/employers",
                icon: Building,
                roles: ["admin"],
                permissions: ["view_employers"]
            },
            {
                name: "Pending Verification",
                href: "/admin/users/pending",
                icon: UserCheck,
                roles: ["admin"],
                permissions: ["verify_users"],
                badge: "15"
            },
            {
                name: "Suspended Accounts",
                href: "/admin/users/suspended",
                icon: ShieldCheck,
                roles: ["admin"],
                permissions: ["manage_users"],
                badge: "2"
            },
            {
                name: "User Activity",
                href: "/admin/users/activity",
                icon: Activity,
                roles: ["admin"],
                permissions: ["view_user_activity"]
            }
        ]
    },

    // Finance & Accounting (QuickBooks Replacement)
    {
        name: "Finance",
        href: "/admin/finance",
        icon: DollarSign,
        roles: ["admin"],
        permissions: ["manage_finance"],
        children: [
            {
                name: "Financial Dashboard",
                href: "/admin/finance/dashboard",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_finance"]
            },
            {
                name: "Revenue & Profit",
                href: "/admin/finance/revenue",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_revenue"],
                badge: "New"
            },
            {
                name: "Expenses",
                href: "/admin/finance/expenses",
                icon: Receipt,
                roles: ["admin"],
                permissions: ["manage_expenses"]
            },
            {
                name: "Transactions",
                href: "/admin/finance/transactions",
                icon: CreditCard,
                roles: ["admin"],
                permissions: ["view_transactions"]
            },
            {
                name: "Invoicing",
                href: "/admin/finance/invoices",
                icon: FileText,
                roles: ["admin"],
                permissions: ["manage_invoices"],
                badge: "5"
            },
            {
                name: "Tax Management",
                href: "/admin/finance/taxes",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["manage_taxes"]
            },
            {
                name: "Financial Reports",
                href: "/admin/finance/reports",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_financial_reports"]
            },
            {
                name: "Payment Gateway",
                href: "/admin/finance/payments",
                icon: Banknote,
                roles: ["admin"],
                permissions: ["manage_payments"]
            }
        ]
    },

    // HR & Payroll Management
    {
        name: "Human Resources",
        href: "/admin/hr",
        icon: UserCog,
        roles: ["admin"],
        permissions: ["manage_hr"],
        children: [
            {
                name: "Employee Directory",
                href: "/admin/hr/employees",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_employees"]
            },
            {
                name: "Payroll Processing",
                href: "/admin/hr/payroll",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["process_payroll"],
                badge: "Due"
            },
            {
                name: "Salary Structure",
                href: "/admin/hr/salaries",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["manage_salaries"]
            },
            {
                name: "Tax & Deductions",
                href: "/admin/hr/tax-deductions",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_tax_deductions"]
            },
            {
                name: "Attendance",
                href: "/admin/hr/attendance",
                icon: Clock,
                roles: ["admin"],
                permissions: ["view_attendance"]
            },
            {
                name: "Performance Reviews",
                href: "/admin/hr/performance",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_performance"]
            },
            {
                name: "HR Analytics",
                href: "/admin/hr/analytics",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_hr_analytics"]
            }
        ]
    },

    // Analytics & Business Intelligence
    {
        name: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        roles: ["admin"],
        permissions: ["view_analytics"],
        children: [
            {
                name: "Business Overview",
                href: "/admin/analytics/overview",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_business_analytics"]
            },
            {
                name: "Financial Performance",
                href: "/admin/analytics/financial",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["view_financial_analytics"]
            },
            {
                name: "User Analytics",
                href: "/admin/analytics/users",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_user_analytics"]
            },
            {
                name: "Call Center Dashboard",
                href: "/admin/analytics/call-center",
                icon: Headphones,
                roles: ["admin"],
                permissions: ["view_call_analytics"]
            },
            {
                name: "Distress Analytics",
                href: "/admin/analytics/distress",
                icon: AlertTriangle,
                roles: ["admin"],
                permissions: ["view_distress_analytics"],
                badge: "Live"
            },
            {
                name: "Platform Performance",
                href: "/admin/analytics/performance",
                icon: Zap,
                roles: ["admin"],
                permissions: ["view_performance_metrics"]
            },
            {
                name: "Geographic Analytics",
                href: "/admin/analytics/geographic",
                icon: Globe,
                roles: ["admin"],
                permissions: ["view_geo_analytics"]
            },
            {
                name: "Custom Reports",
                href: "/admin/analytics/custom",
                icon: LineChart,
                roles: ["admin"],
                permissions: ["create_custom_reports"]
            }
        ]
    },

    // Job & Contract Management
    {
        name: "Jobs & Contracts",
        href: "/admin/jobs",
        icon: Briefcase,
        roles: ["admin"],
        permissions: ["manage_jobs"],
        children: [
            {
                name: "All Jobs",
                href: "/admin/jobs",
                icon: FolderOpen,
                roles: ["admin"],
                permissions: ["view_jobs"]
            },
            {
                name: "Active Contracts",
                href: "/admin/contracts/active",
                icon: FileText,
                roles: ["admin"],
                permissions: ["view_contracts"],
                badge: "45"
            },
            {
                name: "Contract History",
                href: "/admin/contracts/history",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_contract_history"]
            },
            {
                name: "Job Categories",
                href: "/admin/jobs/categories",
                icon: Target,
                roles: ["admin"],
                permissions: ["manage_categories"]
            },
            {
                name: "Skills Management",
                href: "/admin/jobs/skills",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_skills"]
            }
        ]
    },

    // Services & Training
    {
        name: "Services",
        href: "/admin/services",
        icon: Shield,
        roles: ["admin"],
        permissions: ["manage_services"],
        children: [
            {
                name: "Service Catalog",
                href: "/admin/services",
                icon: Shield,
                roles: ["admin"],
                permissions: ["view_services"]
            },
            {
                name: "Training Programs",
                href: "/admin/services/training",
                icon: Video,
                roles: ["admin"],
                permissions: ["manage_training"]
            },
            {
                name: "Certifications",
                href: "/admin/services/certifications",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_certifications"]
            },
            {
                name: "Service Analytics",
                href: "/admin/services/analytics",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_service_analytics"]
            }
        ]
    },

    // Support & Communication
    {
        name: "Support Center",
        href: "/admin/support",
        icon: Headphones,
        roles: ["admin"],
        permissions: ["manage_support"],
        badge: "23",
        children: [
            {
                name: "Support Tickets",
                href: "/admin/support/tickets",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["view_support_tickets"],
                badge: "18"
            },
            {
                name: "Live Chat",
                href: "/admin/support/chat",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["manage_live_chat"],
                badge: "5"
            },
            {
                name: "Email Support",
                href: "/admin/support/email",
                icon: Mail,
                roles: ["admin"],
                permissions: ["manage_email_support"]
            },
            {
                name: "Call Center",
                href: "/admin/support/calls",
                icon: Phone,
                roles: ["admin"],
                permissions: ["view_call_center"]
            },
            {
                name: "Knowledge Base",
                href: "/admin/support/knowledge",
                icon: BookOpen,
                roles: ["admin"],
                permissions: ["manage_knowledge_base"]
            }
        ]
    },

    // System & Settings
    {
        name: "System",
        href: "/admin/system",
        icon: Settings,
        roles: ["admin"],
        permissions: ["manage_system"],
        children: [
            {
                name: "General Settings",
                href: "/admin/settings/general",
                icon: Cog,
                roles: ["admin"],
                permissions: ["manage_settings"]
            },
            {
                name: "Security",
                href: "/admin/settings/security",
                icon: Lock,
                roles: ["admin"],
                permissions: ["manage_security"]
            },
            {
                name: "Notifications",
                href: "/admin/settings/notifications",
                icon: Bell,
                roles: ["admin"],
                permissions: ["manage_notifications"]
            },
            {
                name: "Database Management",
                href: "/admin/settings/database",
                icon: Database,
                roles: ["admin"],
                permissions: ["manage_database"]
            },
            {
                name: "API Management",
                href: "/admin/settings/api",
                icon: Zap,
                roles: ["admin"],
                permissions: ["manage_api"]
            },
            {
                name: "Backup & Recovery",
                href: "/admin/settings/backup",
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
export function getNavigationForRole(role: "worker" | "employer" | "admin", userPermissions: string[] = []) {
    // If user has no permissions and is admin, use dummy permissions with all access
    const effectivePermissions = role === "admin" && userPermissions.length === 0
        ? ALL_ADMIN_PERMISSIONS
        : userPermissions

    const filteredNavigation = navigationConfig.filter(item =>
        item.roles.includes(role) &&
        (!item.permissions || item.permissions.some(permission => effectivePermissions.includes(permission)))
    )

    console.log(`🔧 getNavigationForRole: role=${role}, permissions=`, effectivePermissions)
    console.log(`📋 Filtered navigation for ${role}:`, filteredNavigation)

    return filteredNavigation
}

// Helper function to check if user has access to a route
export function hasAccessToRoute(pathname: string, role: string, userPermissions: string[] = []) {
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
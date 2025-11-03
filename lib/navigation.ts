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
        name: "Jobs",
        href: "/portals/employer/loading",
        icon: Briefcase,
        roles: ["employer"]
    },

    {
        name: "Contracts",
        href: "/portals/employer/loading",
        icon: Briefcase,
        roles: ["employer"]
    },

    {
        name: "Payments",
        href: "/portals/employer/loading",
        icon: CreditCard,
        roles: ["employer"]
    },
    {
        name: "Support",
        href: "/portals/employer/loading",
        icon: MessageSquare,
        roles: ["employer"]
    },
    {
        name: "Settings",
        href: "/portals/employer/settings",
        icon: BarChart3,
        roles: ["employer"]
    },

    // Admin Navigation - Updated to portals structure
    {
        name: "Dashboard",
        href: "/portals/admin/dashboard",
        icon: Home,
        roles: ["admin"],
        permissions: ["manage_cases"],

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
                href: "/portals/admin/distress",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_cases"]
            },
            {
                name: "Worker Reports",
                href: "/portals/admin/cases/loading",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_worker_cases"],
                badge: "8"
            },
            {
                name: "Employer Reports",
                href: "/portals/admin/cases/loading",
                icon: Building,
                roles: ["admin"],
                permissions: ["view_employer_cases"],
                badge: "4"
            },
            {
                name: "Dispute Resolution",
                href: "/portals/admin/cases/",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_disputes"],
                badge: "3"
            },
            {
                name: "Case Analytics",
                href: "/portals/admin/cases/loading",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_case_analytics"]
            }
        ]
    },

    // User Management
    {
        name: "User Management",
        href: "/portals/admin/loading",
        icon: Users,
        roles: ["admin"],
        permissions: ["manage_users"],
        children: [
            {
                name: "All Workers",
                href: "/portals/admin/loading",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_workers"]
            },
            {
                name: "All Employers",
                href: "/portals/admin/loading",
                icon: Building,
                roles: ["admin"],
                permissions: ["view_employers"]
            },
            {
                name: "Pending Verification",
                href: "/portals/admin/loading",
                icon: UserCheck,
                roles: ["admin"],
                permissions: ["verify_users"],
                badge: "15"
            },
            {
                name: "Suspended Accounts",
                href: "/portals/admin/loading",
                icon: ShieldCheck,
                roles: ["admin"],
                permissions: ["manage_users"],
                badge: "2"
            },
            {
                name: "User Activity",
                href: "/portals/admin/users/loading",
                icon: Activity,
                roles: ["admin"],
                permissions: ["view_user_activity"]
            }
        ]
    },

    // Finance & Accounting
    {
        name: "Finance",
        href: "/portals/admin/loading",
        icon: DollarSign,
        roles: ["admin"],
        permissions: ["manage_finance"],
        children: [
            {
                name: "Financial Dashboard",
                href: "/portals/admin/loading",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_finance"]
            },
            {
                name: "Revenue & Profit",
                href: "/portals/admin/loading",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_revenue"],
                badge: "New"
            },
            {
                name: "Expenses",
                href: "/portals/admin/loading",
                icon: Receipt,
                roles: ["admin"],
                permissions: ["manage_expenses"]
            },
            {
                name: "Transactions",
                href: "/portals/admin/loading",
                icon: CreditCard,
                roles: ["admin"],
                permissions: ["view_transactions"]
            },
            {
                name: "Invoicing",
                href: "/portals/admin/loading",
                icon: FileText,
                roles: ["admin"],
                permissions: ["manage_invoices"],
                badge: "5"
            },
            {
                name: "Tax Management",
                href: "/portals/admin/loading",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["manage_taxes"]
            },
            {
                name: "Financial Reports",
                href: "/portals/admin/loading",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_financial_reports"]
            },
            {
                name: "Payment Gateway",
                href: "/portals/admin/loading",
                icon: Banknote,
                roles: ["admin"],
                permissions: ["manage_payments"]
            }
        ]
    },

    // HR & Payroll Management
    {
        name: "Human Resources",
        href: "/portals/admin/loading",
        icon: UserCog,
        roles: ["admin"],
        permissions: ["manage_hr"],
        children: [
            {
                name: "Employee Directory",
                href: "/portals/admin/loading",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_employees"]
            },
            {
                name: "Payroll Processing",
                href: "/portals/admin/loading",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["process_payroll"],
                badge: "Due"
            },
            {
                name: "Salary Structure",
                href: "/portals/admin/loading",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["manage_salaries"]
            },
            {
                name: "Tax & Deductions",
                href: "/portals/admin/loading",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_tax_deductions"]
            },
            {
                name: "Attendance",
                href: "/portals/admin/loading",
                icon: Clock,
                roles: ["admin"],
                permissions: ["view_attendance"]
            },
            {
                name: "Performance Reviews",
                href: "/portals/admin/loading",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_performance"]
            },
            {
                name: "HR Analytics",
                href: "/portals/admin/loading",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_hr_analytics"]
            }
        ]
    },

    // Analytics & Business Intelligence
    {
        name: "Analytics",
        href: "/portals/admin/loading",
        icon: BarChart3,
        roles: ["admin"],
        permissions: ["view_analytics"],
        children: [
            {
                name: "Business Overview",
                href: "/portals/admin/loading",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_business_analytics"]
            },
            {
                name: "Financial Performance",
                href: "/portals/admin/loading",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["view_financial_analytics"]
            },
            {
                name: "User Analytics",
                href: "/portals/admin/loading",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_user_analytics"]
            },
            {
                name: "Call Center Dashboard",
                href: "/portals/admin/loading",
                icon: Headphones,
                roles: ["admin"],
                permissions: ["view_call_analytics"]
            },
            {
                name: "Distress Analytics",
                href: "/portals/admin/loading",
                icon: AlertTriangle,
                roles: ["admin"],
                permissions: ["view_distress_analytics"],
                badge: "Live"
            },
            {
                name: "Platform Performance",
                href: "/portals/admin/loading",
                icon: Zap,
                roles: ["admin"],
                permissions: ["view_performance_metrics"]
            },
            {
                name: "Geographic Analytics",
                href: "/portals/admin/loading",
                icon: Globe,
                roles: ["admin"],
                permissions: ["view_geo_analytics"]
            },
            {
                name: "Custom Reports",
                href: "/portals/admin/loading",
                icon: LineChart,
                roles: ["admin"],
                permissions: ["create_custom_reports"]
            }
        ]
    },

    // Job & Contract Management
    {
        name: "Jobs & Contracts",
        href: "/portals/admin/loading",
        icon: Briefcase,
        roles: ["admin"],
        permissions: ["manage_jobs"],
        children: [
            {
                name: "All Jobs",
                href: "/portals/admin/loading",
                icon: FolderOpen,
                roles: ["admin"],
                permissions: ["view_jobs"]
            },
            {
                name: "Active Contracts",
                href: "/portals/admin/loading",
                icon: FileText,
                roles: ["admin"],
                permissions: ["view_contracts"],
                badge: "45"
            },
            {
                name: "Contract History",
                href: "/portals/admin/loading",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_contract_history"]
            },
            {
                name: "Job Categories",
                href: "/portals/admin/loading",
                icon: Target,
                roles: ["admin"],
                permissions: ["manage_categories"]
            },
            {
                name: "Skills Management",
                href: "/portals/admin/loading",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_skills"]
            }
        ]
    },

    // Services & Training
    {
        name: "Services",
        href: "/portals/admin/loading",
        icon: Shield,
        roles: ["admin"],
        permissions: ["manage_services"],
        children: [
            {
                name: "Service Catalog",
                href: "/portals/admin/loading",
                icon: Shield,
                roles: ["admin"],
                permissions: ["view_services"]
            },
            {
                name: "Training Programs",
                href: "/portals/admin/loading",
                icon: Video,
                roles: ["admin"],
                permissions: ["manage_training"]
            },
            {
                name: "Certifications",
                href: "/portals/admin/loading",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_certifications"]
            },
            {
                name: "Service Analytics",
                href: "/portals/admin/loading",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_service_analytics"]
            }
        ]
    },

    // Support & Communication
    {
        name: "Support Center",
        href: "/portals/admin/loading",
        icon: Headphones,
        roles: ["admin"],
        permissions: ["manage_support"],
        badge: "23",
        children: [
            {
                name: "Support Tickets",
                href: "/portals/admin/loading",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["view_support_tickets"],
                badge: "18"
            },
            {
                name: "Live Chat",
                href: "/portals/admin/loading",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["manage_live_chat"],
                badge: "5"
            },
            {
                name: "Email Support",
                href: "/portals/admin/loading",
                icon: Mail,
                roles: ["admin"],
                permissions: ["manage_email_support"]
            },
            {
                name: "Call Center",
                href: "/portals/admin/loading",
                icon: Phone,
                roles: ["admin"],
                permissions: ["view_call_center"]
            },
            {
                name: "Knowledge Base",
                href: "/portals/admin/loading",
                icon: BookOpen,
                roles: ["admin"],
                permissions: ["manage_knowledge_base"]
            }
        ]
    },

    // System & Settings
    {
        name: "Settings",
        href: "/portals/admin/settings",
        icon: Settings,
        roles: ["admin"],
        permissions: ["manage_system"],
        children: [
            {
                name: "General Settings",
                href: "/portals/admin/settings",
                icon: Cog,
                roles: ["admin"],
                permissions: ["manage_settings"]
            },
            {
                name: "Profile",
                href: "/portals/admin/kyc",
                icon: Lock,
                roles: ["admin"],
                permissions: ["manage_security"]
            },
            {
                name: "Notifications",
                href: "/portals/admin/loading",
                icon: Bell,
                roles: ["admin"],
                permissions: ["manage_notifications"]
            },
            {
                name: "Database Management",
                href: "/portals/admin/loading",
                icon: Database,
                roles: ["admin"],
                permissions: ["manage_database"]
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
    const effectivePermissions = ALL_ADMIN_PERMISSIONS

    const filteredNavigation = navigationConfig.filter(item => {
        // First check if the item is for the current role
        if (!item.roles.includes(role)) {
            return false
        }

        // For admin with no specific permissions, show all admin items
        if (role === "admin" && userPermissions.length === 0) {
            return true
        }

        // If item has permissions, check if user has at least one of them
        if (item.permissions && item.permissions.length > 0) {
            return item.permissions.some(permission => effectivePermissions.includes(permission))
        }

        // If item has no permissions, show it
        return true
    })

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

    // For admin with no specific permissions, allow access to all admin routes
    if (role === "admin" && userPermissions.length === 0) {
        console.log(`✅ Admin access granted to ${pathname} (full admin privileges)`)
        return true
    }

    if (route.permissions && route.permissions.length > 0 && !route.permissions.some(p => effectivePermissions.includes(p))) {
        console.log(`❌ Permission mismatch: route requires ${route.permissions}, user has`, effectivePermissions)
        return false
    }

    console.log(`✅ Access granted to ${pathname}`)
    return true
}

// Helper function to get flat navigation (for mobile)
export function getFlatNavigation(role: "employee" | "employer" | "admin", userPermissions: string[] = []) {
    // If user has no permissions and is admin, use dummy permissions with all access
    // const effectivePermissions = role === "admin" && userPermissions.length === 0
    //     ? ALL_ADMIN_PERMISSIONS
    //     : userPermissions

    // temporarily added to give admin all rights from the db

    const effectivePermissions = role === "admin" ? ALL_ADMIN_PERMISSIONS : userPermissions

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
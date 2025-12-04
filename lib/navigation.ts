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
    Activity,
    HelpCircle
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
        name: "My Contract",
        href: "/portals/worker/contract",
        icon: Calendar,
        roles: ["employee"]
    },

    {
        name: "Wallet",
        href: "/portals/worker/wallet",
        icon: CreditCard,
        roles: ["employee"]
    },

    {
        name: "Notifications",
        href: "/portals/worker/notifications",
        icon: Bell,
        roles: ["employee"],
        badge: "4"

    },
    {
        name: "Support Messages",
        href: "/portals/worker/support",
        icon: MessageSquare,
        roles: ["employee"],
        badge: "3"
    },
    {
        name: "Services",
        href: "/portals/worker/services",
        icon: Shield,
        roles: ["employee"]
    },

    {
        name: "Classes",
        href: "/portals/worker/training",
        icon: Video,
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
        href: "/portals/employer/post-job",
        icon: Briefcase,
        roles: ["employer"]
    },

    {
        name: "Contracts",
        href: "/portals/employer/contracts",
        icon: Calendar,
        roles: ["employer"]
    },

    {
        name: "Payments",
        href: "/portals/employer/payments",
        icon: CreditCard,
        roles: ["employer"]
    },
    {
        name: "Notifications",
        href: "/portals/employer/notifications",
        icon: Bell,
        roles: ["employer"],
        badge: "4"

    },
    {
        name: "Support Messages",
        href: "/portals/employer/support",
        icon: MessageSquare,
        roles: ["employer"]
    },
    {
        name: "Help Center",
        href: "/portals/employer/help-center",
        icon: HelpCircle,
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

    // User Management
    {
        name: "User Management",
        href: "",
        icon: Users,
        roles: ["admin"],
        permissions: ["manage_users"],
        children: [
            {
                name: "All Users",
                href: "/portals/admin/allUsers",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_workers"]
            },
            {
                name: "Registrations",
                href: "/portals/admin/kyc",
                icon: Lock,
                roles: ["admin"],
                permissions: ["manage_security"]
            },
            {
                name: "User Analytics",
                href: "/portals/admin/analytics",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_employers"]
            }

        ]
    },

    // Job & Contract Management
    {
        name: "Jobs & Contracts",
        href: "",
        icon: Briefcase,
        roles: ["admin"],
        permissions: ["manage_jobs"],
        children: [
            {
                name: "Jobs",
                href: "/portals/admin/jobs",
                icon: FolderOpen,
                roles: ["admin"],
                permissions: ["view_jobs"]
            },
            {
                name: "Contracts",
                href: "/portals/admin/contracts",
                icon: FileText,
                roles: ["admin"],
                permissions: ["view_contracts"],
                badge: "45"
            }

        ]
    },

    // Support & Communication
    {
        name: "Support Center",
        href: "",
        icon: Headphones,
        roles: ["admin"],
        permissions: ["manage_support"],
        badge: "23",
        children: [
            {
                name: "Distress Report",
                href: "/portals/admin/distress",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_cases"]
            },
            {
                name: "All Cases",
                href: "/portals/admin/cases",
                icon: ClipboardList,
                roles: ["admin"],
                permissions: ["view_cases"]
            },

            {
                name: "Live Chat",
                href: "/portals/admin/livechat",
                icon: MessageSquare,
                roles: ["admin"],
                permissions: ["manage_live_chat"],
                badge: "5"
            }
        ]
    },


    // Finance & Accounting
    {
        name: "Finance",
        href: "",
        icon: DollarSign,
        roles: ["admin"],
        permissions: ["manage_finance"],
        children: [
            {
                name: "Financial Dashboard",
                href: "",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_finance"]
            },
            {
                name: "Revenue & Profit",
                href: "",
                icon: TrendingUp,
                roles: ["admin"],
                permissions: ["view_revenue"],
                badge: "New"
            },
            {
                name: "Expenses",
                href: "",
                icon: Receipt,
                roles: ["admin"],
                permissions: ["manage_expenses"]
            },
            {
                name: "Transactions",
                href: "",
                icon: CreditCard,
                roles: ["admin"],
                permissions: ["view_transactions"]
            },
            {
                name: "Invoicing",
                href: "",
                icon: FileText,
                roles: ["admin"],
                permissions: ["manage_invoices"],
                badge: "5"
            },
            {
                name: "Tax Management",
                href: "",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["manage_taxes"]
            },
            {
                name: "Financial Reports",
                href: "",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_financial_reports"]
            }
        ]
    },

    // HR & Payroll Management
    {
        name: "Human Resources",
        href: "",
        icon: UserCog,
        roles: ["admin"],
        permissions: ["manage_hr"],
        children: [
            {
                name: "Employee Directory",
                href: "",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_employees"]
            },
            {
                name: "Payroll Processing",
                href: "",
                icon: Calculator,
                roles: ["admin"],
                permissions: ["process_payroll"],
                badge: "Due"
            },
            {
                name: "Salary Structure",
                href: "",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["manage_salaries"]
            },
            {
                name: "Tax & Deductions",
                href: "",
                icon: Scale,
                roles: ["admin"],
                permissions: ["manage_tax_deductions"]
            },
            {
                name: "Attendance",
                href: "",
                icon: Clock,
                roles: ["admin"],
                permissions: ["view_attendance"]
            },
            {
                name: "Performance Reviews",
                href: "",
                icon: Award,
                roles: ["admin"],
                permissions: ["manage_performance"]
            },
            {
                name: "HR Analytics",
                href: "",
                icon: BarChart3,
                roles: ["admin"],
                permissions: ["view_hr_analytics"]
            }
        ]
    },

    // Analytics & Business Intelligence
    {
        name: "Analytics",
        href: "",
        icon: BarChart3,
        roles: ["admin"],
        permissions: ["view_analytics"],
        children: [
            {
                name: "Business Overview",
                href: "",
                icon: PieChart,
                roles: ["admin"],
                permissions: ["view_business_analytics"]
            },
            {
                name: "Financial Performance",
                href: "",
                icon: DollarSign,
                roles: ["admin"],
                permissions: ["view_financial_analytics"]
            },
            {
                name: "User Analytics",
                href: "",
                icon: Users,
                roles: ["admin"],
                permissions: ["view_user_analytics"]
            },
            {
                name: "Call Center Dashboard",
                href: "",
                icon: Headphones,
                roles: ["admin"],
                permissions: ["view_call_analytics"]
            },
            {
                name: "Distress Analytics",
                href: "",
                icon: AlertTriangle,
                roles: ["admin"],
                permissions: ["view_distress_analytics"],
                badge: "Live"
            },

            {
                name: "Geographic Analytics",
                href: "",
                icon: Globe,
                roles: ["admin"],
                permissions: ["view_geo_analytics"]
            },
            {
                name: "Custom Reports",
                href: "",
                icon: LineChart,
                roles: ["admin"],
                permissions: ["create_custom_reports"]
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
            }

        ]
    },
    {
        name: "Notifications",
        href: "/portals/admin/notifications",
        icon: Bell,
        roles: ["admin"],
        permissions: ["manage_cases"],

    },
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
export function getNavigationForRole(role: "employee" | "employer" | "admin" | string, userPermissions: string[] = []) {
    // Normalize extended role names to base roles used in navigation config
    const normalizedRole: "employee" | "employer" | "admin" = (() => {
        const r = (role || "").toString().toLowerCase()
        if (r === "employee") return "employee"
        if (r === "employer") return "employer"
        // Map any admin variants (super_admin, hospital_admin, photo_studio_admin, embassy_admin) to "admin"
        if (r === "admin" || r.includes("admin")) return "admin"
        // Default fallback
        return "employee"
    })()
    // If user has no permissions and is admin, use dummy permissions with all access
    const effectivePermissions = ALL_ADMIN_PERMISSIONS

    const filteredNavigation = navigationConfig.filter(item => {
        // First check if the item is for the current role
        if (!item.roles.includes(normalizedRole)) {
            return false
        }

        // For admin with no specific permissions, show all admin items
        if (normalizedRole === "admin" && userPermissions.length === 0) {
            return true
        }

        // If item has permissions, check if user has at least one of them
        if (item.permissions && item.permissions.length > 0) {
            return item.permissions.some(permission => effectivePermissions.includes(permission))
        }

        // If item has no permissions, show it
        return true
    })

    console.log(`🔧 getNavigationForRole: role=${normalizedRole} (raw=${role}), permissions=`, effectivePermissions)
    console.log(`📋 Filtered navigation for ${normalizedRole}:`, filteredNavigation.map(item => item.name))

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
    const isAdminLike = (role || "").toLowerCase().includes("admin")
    const effectivePermissions = isAdminLike && userPermissions.length === 0
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
    const normalizedRole = ((role || "").toLowerCase().includes("admin")) ? "admin" : (role as any)
    if (!route.roles.includes(normalizedRole as any)) {
        console.log(`❌ Role mismatch: route requires ${route.roles}, user has ${normalizedRole} (raw=${role})`)
        return false
    }

    // For admin with no specific permissions, allow access to all admin routes
    if (normalizedRole === "admin" && userPermissions.length === 0) {
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
export function getFlatNavigation(role: "employee" | "employer" | "admin" | string, userPermissions: string[] = []) {
    const normalizedRole: "employee" | "employer" | "admin" = (() => {
        const r = (role || "").toString().toLowerCase()
        if (r === "employee") return "employee"
        if (r === "employer") return "employer"
        if (r === "admin" || r.includes("admin")) return "admin"
        return "employee"
    })()
    // If user has no permissions and is admin, use dummy permissions with all access
    // const effectivePermissions = role === "admin" && userPermissions.length === 0
    //     ? ALL_ADMIN_PERMISSIONS
    //     : userPermissions

    // temporarily added to give admin all rights from the db

    const effectivePermissions = normalizedRole === "admin" ? ALL_ADMIN_PERMISSIONS : userPermissions

    const navigation = getNavigationForRole(normalizedRole, effectivePermissions)
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
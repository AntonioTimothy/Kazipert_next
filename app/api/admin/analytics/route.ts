import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (!accessToken) {
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        if (!decoded) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        return user
    } catch (error) {
        console.error('Error getting user from request:', error)
        return null
    }
}

// GET /api/admin/analytics - Get users analytics data
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request)

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Get total counts
        const [
            totalUsers,
            totalEmployers,
            totalEmployees,
            totalAdmins,
            activeUsers,
            pendingUsers,
            suspendedUsers,
            verifiedUsers,
            todayRegistrations,
            weekRegistrations,
            monthRegistrations
        ] = await Promise.all([
            // Total counts
            prisma.user.count(),
            prisma.user.count({ where: { role: 'EMPLOYER' } }),
            prisma.user.count({ where: { role: 'EMPLOYEE' } }),
            prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),

            // Status counts
            prisma.user.count({
                where: {
                    adminStatus: 'ACTIVE',
                    verified: true
                }
            }),
            prisma.user.count({
                where: {
                    OR: [
                        { verified: false },
                        { adminStatus: 'PENDING' }
                    ]
                }
            }),
            prisma.user.count({ where: { adminStatus: 'SUSPENDED' } }),
            prisma.user.count({ where: { verified: true } }),

            // Time-based counts
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }
                }
            }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 30))
                    }
                }
            })
        ])

        // Get registration data for charts (last 30 days)
        const registrationData = await getRegistrationTrends()

        // Get role distribution
        const roleDistribution = await getRoleDistribution()

        // Get verification stats
        const verificationStats = await getVerificationStats()

        return NextResponse.json({
            overview: {
                totalUsers,
                totalEmployers,
                totalEmployees,
                totalAdmins,
                activeUsers,
                pendingUsers,
                suspendedUsers,
                verifiedUsers,
                verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0
            },
            trends: {
                todayRegistrations,
                weekRegistrations,
                monthRegistrations,
                registrationData,
                growthRate: calculateGrowthRate(monthRegistrations, totalUsers)
            },
            distribution: {
                roles: roleDistribution,
                verification: verificationStats
            },
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Error fetching analytics:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// Helper function to get registration trends
async function getRegistrationTrends() {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (29 - i))
        date.setHours(0, 0, 0, 0)
        return date
    })

    const registrationCounts = await Promise.all(
        last30Days.map(async (date) => {
            const nextDay = new Date(date)
            nextDay.setDate(nextDay.getDate() + 1)

            const count = await prisma.user.count({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDay
                    }
                }
            })

            return {
                date: date.toISOString().split('T')[0],
                count
            }
        })
    )

    return registrationCounts
}

// Helper function to get role distribution
async function getRoleDistribution() {
    const roles = ['EMPLOYER', 'EMPLOYEE', 'ADMIN', 'SUPER_ADMIN']

    const distribution = await Promise.all(
        roles.map(async (role) => {
            const count = await prisma.user.count({ where: { role } })
            return { role, count }
        })
    )

    return distribution
}

// Helper function to get verification stats
async function getVerificationStats() {
    const [emailVerified, phoneVerified, fullyVerified] = await Promise.all([
        prisma.user.count({ where: { emailVerified: true } }),
        prisma.user.count({ where: { phoneVerified: true } }),
        prisma.user.count({ where: { emailVerified: true, phoneVerified: true } })
    ])

    return {
        emailVerified,
        phoneVerified,
        fullyVerified
    }
}

// Helper function to calculate growth rate
function calculateGrowthRate(newRegistrations: number, totalUsers: number): number {
    if (totalUsers - newRegistrations === 0) return 0
    return Math.round((newRegistrations / (totalUsers - newRegistrations)) * 100)
}
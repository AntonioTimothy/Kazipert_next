import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        console.log('🔐 ADMIN USERS API - Access token from cookies:', !!accessToken)

        if (!accessToken) {
            console.log('❌ ADMIN USERS API - No access token found in cookies')
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        console.log('🔐 ADMIN USERS API - Token decoded:', !!decoded)

        if (!decoded) {
            console.log('❌ ADMIN USERS API - Invalid or expired token')
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                profile: true
            }
        })

        console.log('🔐 ADMIN USERS API - User found:', user?.email, 'Role:', user?.role)
        return user
    } catch (error) {
        console.error('❌ ADMIN USERS API - Error getting user from request:', error)
        return null
    }
}

// GET /api/admin/users - Get all users with filters
export async function GET(request: NextRequest) {
    try {
        console.log('📋 ADMIN USERS API - GET request received')
        const user = await getUserFromRequest(request)

        if (!user) {
            console.log('❌ ADMIN USERS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
            console.log('❌ ADMIN USERS API - Forbidden: User is not admin, role is:', user.role)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        console.log('📋 ADMIN USERS API - Request params:', { role, status, search, page, limit })

        // Build where clause
        const where: any = {}

        if (role && role !== 'all') {
            where.role = role
        }

        if (status && status !== 'all') {
            if (status === 'active') {
                where.adminStatus = 'ACTIVE'
                where.verified = true
            } else if (status === 'pending') {
                where.OR = [
                    { verified: false },
                    { adminStatus: 'PENDING' }
                ]
            } else if (status === 'suspended') {
                where.adminStatus = 'SUSPENDED'
            }
        }

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } }
            ]
        }

        console.log('🔍 ADMIN USERS API - Query where clause:', JSON.stringify(where))

        // Get users with pagination
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                include: {
                    profile: true,
                    kycDetails: true,
                    onboardingProgress: true,
                    _count: {
                        select: {
                            jobsPosted: true,
                            jobApplications: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.user.count({ where })
        ])

        // Transform data for frontend
        const transformedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            adminStatus: user.adminStatus,
            verified: user.verified,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            country: user.country,
            company: user.company,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            profile: user.profile,
            kycDetails: user.kycDetails,
            onboardingProgress: user.onboardingProgress,
            stats: {
                jobsPosted: user._count.jobsPosted,
                applications: user._count.jobApplications
            }
        }))

        console.log('✅ ADMIN USERS API - Found', users.length, 'users out of', total)

        return NextResponse.json({
            users: transformedUsers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('❌ ADMIN USERS API - Error fetching users:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PATCH /api/admin/users - Update user status
export async function PATCH(request: NextRequest) {
    try {
        console.log('📝 ADMIN USERS API - PATCH request received')
        const user = await getUserFromRequest(request)

        if (!user) {
            console.log('❌ ADMIN USERS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin
        if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
            console.log('❌ ADMIN USERS API - Forbidden: User is not admin, role is:', user.role)
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            console.log('❌ ADMIN USERS API - User ID is required')
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { adminStatus, verified } = body

        console.log('📝 ADMIN USERS API - Updating user:', userId, 'with data:', { adminStatus, verified })

        // Check if user is trying to modify themselves
        if (userId === user.id) {
            console.log('❌ ADMIN USERS API - Cannot modify own account')
            return NextResponse.json(
                { error: 'Cannot modify your own account' },
                { status: 400 }
            )
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(adminStatus && { adminStatus }),
                ...(verified !== undefined && { verified })
            },
            include: {
                profile: true
            }
        })

        console.log('✅ ADMIN USERS API - User updated successfully:', updatedUser.email)

        return NextResponse.json({
            user: updatedUser,
            message: 'User updated successfully'
        })
    } catch (error) {
        console.error('❌ ADMIN USERS API - Error updating user:', error)

        // Provide more specific error messages
        if (error instanceof Error) {
            if (error.message.includes('Record to update not found')) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                )
            }
            if (error.message.includes('Invalid `prisma.user.update()`')) {
                return NextResponse.json(
                    { error: 'Invalid user data provided' },
                    { status: 400 }
                )
            }
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/users - Delete user
export async function DELETE(request: NextRequest) {
    try {
        console.log('🗑️ ADMIN USERS API - DELETE request received')
        const user = await getUserFromRequest(request)

        if (!user) {
            console.log('❌ ADMIN USERS API - Unauthorized: No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if user is admin (only SUPER_ADMIN can delete)
        if (user.role !== 'SUPER_ADMIN') {
            console.log('❌ ADMIN USERS API - Forbidden: Only super admins can delete users')
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            console.log('❌ ADMIN USERS API - User ID is required')
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Check if user is trying to delete themselves
        if (userId === user.id) {
            console.log('❌ ADMIN USERS API - Cannot delete own account')
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            )
        }

        console.log('🗑️ ADMIN USERS API - Deleting user:', userId)

        // Delete user and related records (cascade delete should handle related records)
        await prisma.user.delete({
            where: { id: userId }
        })

        console.log('✅ ADMIN USERS API - User deleted successfully')

        return NextResponse.json({
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('❌ ADMIN USERS API - Error deleting user:', error)

        if (error instanceof Error) {
            if (error.message.includes('Record to delete does not exist')) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                )
            }
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
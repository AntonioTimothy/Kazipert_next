import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// GET /api/admin/users - Get all admin users
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || 'all'
        const status = searchParams.get('status') || 'all'

        const where = {
            AND: [
                { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
                search ? {
                    OR: [
                        { fullName: { contains: search, mode: 'insensitive' } },
                        { email: { contains: search, mode: 'insensitive' } },
                        { company: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                role !== 'all' ? { role } : {},
                status !== 'all' ? { adminStatus: status } : {}
            ]
        }

        const users = await prisma.user.findMany({
            where,
            include: {
                userPermissions: {
                    include: {
                        permission: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ users })
    } catch (error) {
        console.error('Get admin users error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch admin users' },
            { status: 500 }
        )
    }
}

// POST /api/admin/users - Create new admin user
export async function POST(request: NextRequest) {
    try {
        const { firstName, lastName, email, phone, company, role, permissions } = await request.json()

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !role) {
            return NextResponse.json(
                { error: 'All required fields must be filled' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            )
        }

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await hashPassword(tempPassword)

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                phone,
                fullName: `${firstName} ${lastName}`,
                company,
                role: role === 'super_admin' ? 'ADMIN' : role.toUpperCase(),
                adminStatus: 'PENDING',
                verified: false
            },
            include: {
                userPermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        })

        // TODO: Send email with login instructions and temporary password
        console.log('Admin user created, send login instructions to:', email, 'Temp password:', tempPassword)

        return NextResponse.json(
            {
                message: 'Admin user created successfully',
                user: {
                    ...user,
                    password: undefined // Remove password from response
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Create admin user error:', error)
        return NextResponse.json(
            { error: 'Failed to create admin user' },
            { status: 500 }
        )
    }
}
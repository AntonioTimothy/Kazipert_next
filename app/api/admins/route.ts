import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search') || ''
        const role = searchParams.get('role') || 'all'

        // Build where clause for filtering
        const where: any = {
            role: {
                in: ['SUPER_ADMIN', 'HOSPITAL_ADMIN', 'PHOTO_STUDIO_ADMIN', 'EMBASSY_ADMIN', 'ADMIN']
            }
        }

        // Add search filter
        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Add role filter
        if (role !== 'all') {
            const roleMap: { [key: string]: any } = {
                'super_admin': 'SUPER_ADMIN',
                'hospital_admin': 'HOSPITAL_ADMIN',
                'photo_studio_admin': 'PHOTO_STUDIO_ADMIN',
                'embassy_admin': 'EMBASSY_ADMIN',
                'admin': 'ADMIN'
            }
            where.role = roleMap[role] || 'ADMIN'
        }

        // Fetch admins from database
        const admins = await prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                phone: true,
                firstName: true,
                lastName: true,
                fullName: true,
                role: true,
                company: true,
                adminStatus: true,
                lastLogin: true,
                createdAt: true,
                permissions: true,
                profile: {
                    select: {
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Format the response
        const formattedAdmins = admins.map(admin => ({
            id: admin.id,
            name: admin.fullName || `${admin.firstName} ${admin.lastName}`,
            email: admin.email,
            phone: admin.phone,
            role: admin.role.toLowerCase(),
            status: admin.adminStatus?.toLowerCase() || 'pending',
            avatar: admin.profile?.avatar || '/placeholder.svg',
            lastActive: admin.lastLogin ? formatLastActive(admin.lastLogin) : 'Never',
            permissions: Array.isArray(admin.permissions) ? admin.permissions : [],
            department: admin.company || 'Kazipert'
        }))

        return NextResponse.json(formattedAdmins)
    } catch (error) {
        console.error('Error fetching admins:', error)
        return NextResponse.json(
            { error: 'Failed to fetch admins' },
            { status: 500 }
        )
    }
}

function formatLastActive(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
}
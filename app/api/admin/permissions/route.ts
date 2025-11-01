import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/permissions - Get all permissions
export async function GET() {
    try {
        const permissions = await prisma.permission.findMany({
            orderBy: { category: 'asc' }
        })

        // Group by category
        const groupedPermissions = permissions.reduce((acc, permission) => {
            if (!acc[permission.category]) {
                acc[permission.category] = []
            }
            acc[permission.category].push(permission)
            return acc
        }, {} as Record<string, typeof permissions>)

        return NextResponse.json({ permissions: groupedPermissions })
    } catch (error) {
        console.error('Get permissions error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch permissions' },
            { status: 500 }
        )
    }
}
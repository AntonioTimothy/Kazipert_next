import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/admin/users/[id] - Get specific admin user
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            include: {
                userPermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error('Get user error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        )
    }
}

// PUT /api/admin/users/[id] - Update admin user
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { permissions, adminStatus, ...userData } = await request.json()

        const user = await prisma.user.update({
            where: { id: params.id },
            data: userData,
            include: {
                userPermissions: {
                    include: {
                        permission: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'User updated successfully',
            user
        })
    } catch (error) {
        console.error('Update user error:', error)
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/users/[id] - Delete admin user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.user.delete({
            where: { id: params.id }
        })

        return NextResponse.json({
            message: 'User deleted successfully'
        })
    } catch (error) {
        console.error('Delete user error:', error)
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        )
    }
}
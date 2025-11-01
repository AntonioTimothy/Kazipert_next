import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const adminId = params.id

        // Delete admin from database
        await prisma.user.delete({
            where: { id: adminId }
        })

        return NextResponse.json({
            success: true,
            message: 'Admin deleted successfully'
        })
    } catch (error) {
        console.error('Error deleting admin:', error)
        return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
    }
}
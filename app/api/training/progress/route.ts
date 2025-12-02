import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// POST - Update progress
export async function POST(request: NextRequest) {
    try {
        const cookieStore = cookies()
        const accessToken = cookieStore.get('accessToken')?.value

        if (!accessToken) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = await verifyAccessToken(accessToken)
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        const userId = decoded.userId
        const body = await request.json()
        const { classId, watchedDuration, completed } = body

        if (!classId) {
            return NextResponse.json({ error: 'Class ID required' }, { status: 400 })
        }

        const progress = await prisma.classProgress.upsert({
            where: {
                userId_classId: {
                    userId,
                    classId
                }
            },
            create: {
                userId,
                classId,
                watchedDuration: watchedDuration || 0,
                completed: completed || false
            },
            update: {
                watchedDuration: watchedDuration || 0,
                completed: completed || false
            }
        })

        return NextResponse.json(progress, { status: 200 })
    } catch (error) {
        console.error('❌ UPDATE PROGRESS ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to update progress' },
            { status: 500 }
        )
    }
}

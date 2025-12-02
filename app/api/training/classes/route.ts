import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// GET training classes
export async function GET(request: NextRequest) {
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

        const classes = await prisma.trainingClass.findMany({
            where: {
                isPublished: true
            },
            include: {
                questions: true,
                progress: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })

        return NextResponse.json({ classes }, { status: 200 })
    } catch (error) {
        console.error('❌ GET TRAINING CLASSES ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch training classes' },
            { status: 500 }
        )
    }
}

// POST - Create training class (Admin only)
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

        const userRole = decoded.role

        if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const body = await request.json()
        const { title, description, videoUrl, thumbnailUrl, duration, order, isPublished } = body

        if (!title || !description || !videoUrl) {
            return NextResponse.json({
                error: 'Title, description, and videoUrl required'
            }, { status: 400 })
        }

        const trainingClass = await prisma.trainingClass.create({
            data: {
                title,
                description,
                videoUrl,
                thumbnailUrl,
                duration: duration || 0,
                order: order || 0,
                isPublished: isPublished || false
            }
        })

        return NextResponse.json(trainingClass, { status: 201 })
    } catch (error) {
        console.error('❌ CREATE TRAINING CLASS ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to create training class' },
            { status: 500 }
        )
    }
}

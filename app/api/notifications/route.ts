import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// GET notifications
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
        const { searchParams } = new URL(request.url)
        const unreadOnly = searchParams.get('unreadOnly') === 'true'

        const where: any = { userId }
        if (unreadOnly) {
            where.read = false
        }

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        })

        const unreadCount = await prisma.notification.count({
            where: {
                userId,
                read: false
            }
        })

        return NextResponse.json({
            notifications,
            unreadCount
        }, { status: 200 })
    } catch (error) {
        console.error('❌ GET NOTIFICATIONS ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        )
    }
}

// POST - Create notification
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

        const body = await request.json()
        const { userId, title, message, type, actionUrl, metadata } = body

        if (!userId || !title || !message || !type) {
            return NextResponse.json({
                error: 'userId, title, message, and type required'
            }, { status: 400 })
        }

        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                actionUrl,
                metadata
            }
        })

        // TODO: Send real-time notification via Socket.io

        return NextResponse.json(notification, { status: 201 })
    } catch (error) {
        console.error('❌ CREATE NOTIFICATION ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to create notification' },
            { status: 500 }
        )
    }
}

// PATCH - Mark as read
export async function PATCH(request: NextRequest) {
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
        const { notificationId, markAllAsRead } = body

        if (markAllAsRead) {
            await prisma.notification.updateMany({
                where: {
                    userId,
                    read: false
                },
                data: {
                    read: true
                }
            })
        } else if (notificationId) {
            await prisma.notification.update({
                where: {
                    id: notificationId,
                    userId // Ensure user owns this notification
                },
                data: {
                    read: true
                }
            })
        }

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('❌ MARK NOTIFICATION READ ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to mark notification as read' },
            { status: 500 }
        )
    }
}

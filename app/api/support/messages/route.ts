import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// POST - Add message to ticket
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
        const userRole = decoded.role
        const body = await request.json()
        const { ticketId, message, attachments, isInternal } = body

        if (!ticketId || !message) {
            return NextResponse.json({
                error: 'Ticket ID and message required'
            }, { status: 400 })
        }

        // Verify ticket exists and user has access
        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                creator: {
                    select: { id: true }
                }
            }
        })

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
        }

        // Check access
        const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'
        const isCreator = ticket.creatorId === userId

        if (!isAdmin && !isCreator) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // Only admins can create internal notes
        const messageIsInternal = isInternal && isAdmin

        const ticketMessage = await prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: userId,
                message,
                attachments,
                isInternal: messageIsInternal
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true
                    }
                }
            }
        })

        // Update ticket status to IN_PROGRESS if it was OPEN
        if (ticket.status === 'OPEN') {
            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { status: 'IN_PROGRESS' }
            })
        }

        // Send notification to the other party
        if (!messageIsInternal) {
            const recipientId = isCreator ? ticket.assigneeId : ticket.creatorId

            if (recipientId) {
                await prisma.notification.create({
                    data: {
                        userId: recipientId,
                        title: 'New Message on Support Ticket',
                        message: `New message on ticket #${ticket.ticketNumber}`,
                        type: 'SUPPORT_TICKET',
                        actionUrl: isAdmin
                            ? `/portals/admin/cases`
                            : `/portals/worker/support`,
                        metadata: { ticketId: ticket.id }
                    }
                })
            }
        }

        // TODO: Send real-time message via Socket.io

        return NextResponse.json(ticketMessage, { status: 201 })
    } catch (error) {
        console.error('❌ CREATE TICKET MESSAGE ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to create message' },
            { status: 500 }
        )
    }
}

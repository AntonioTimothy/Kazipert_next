import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// GET support tickets
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
        const userRole = decoded.role
        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        let where: any = {}

        if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            // Admins see all tickets
            if (status) {
                where.status = status
            }
        } else {
            // Users see only their tickets
            where.creatorId = userId
            if (status) {
                where.status = status
            }
        }

        const tickets = await prisma.supportTicket.findMany({
            where,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                messages: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                role: true
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ tickets }, { status: 200 })
    } catch (error) {
        console.error('❌ GET TICKETS ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tickets' },
            { status: 500 }
        )
    }
}

// POST - Create ticket
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
        const { subject, description, category, priority, attachments } = body

        if (!subject || !description || !category) {
            return NextResponse.json({
                error: 'Subject, description, and category required'
            }, { status: 400 })
        }

        // Generate ticket number
        const ticketNumber = `TKT-${Date.now()}`

        const ticket = await prisma.supportTicket.create({
            data: {
                ticketNumber,
                subject,
                description,
                category,
                priority: priority || 'MEDIUM',
                creatorId: userId,
                attachments
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                }
            }
        })

        // Create notification for admins
        const admins = await prisma.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'SUPER_ADMIN']
                }
            },
            select: { id: true }
        })

        for (const admin of admins) {
            await prisma.notification.create({
                data: {
                    userId: admin.id,
                    title: 'New Support Ticket',
                    message: `${ticket.creator.firstName} ${ticket.creator.lastName} created a new ${category} ticket: ${subject}`,
                    type: 'SUPPORT_TICKET',
                    actionUrl: `/portals/admin/cases`,
                    metadata: { ticketId: ticket.id }
                }
            })
        }

        return NextResponse.json(ticket, { status: 201 })
    } catch (error) {
        console.error('❌ CREATE TICKET ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to create ticket' },
            { status: 500 }
        )
    }
}

// PATCH - Update ticket
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

        const userRole = decoded.role
        const body = await request.json()
        const { ticketId, status, priority, escalationLevel, assigneeId } = body

        if (!ticketId) {
            return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 })
        }

        // Only admins can update tickets
        if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const updateData: any = {}
        if (status) updateData.status = status
        if (priority) updateData.priority = priority
        if (escalationLevel) updateData.escalationLevel = escalationLevel
        if (assigneeId) updateData.assigneeId = assigneeId
        if (status === 'CLOSED' || status === 'RESOLVED') {
            updateData.closedAt = new Date()
        }

        const ticket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: updateData,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                assignee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        })

        // Notify ticket creator
        await prisma.notification.create({
            data: {
                userId: ticket.creatorId,
                title: 'Ticket Updated',
                message: `Your ticket #${ticket.ticketNumber} has been updated`,
                type: 'SUPPORT_TICKET',
                actionUrl: `/portals/worker/support`,
                metadata: { ticketId: ticket.id }
            }
        })

        return NextResponse.json(ticket, { status: 200 })
    } catch (error) {
        console.error('❌ UPDATE TICKET ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to update ticket' },
            { status: 500 }
        )
    }
}

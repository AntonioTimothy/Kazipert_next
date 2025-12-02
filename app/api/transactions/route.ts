import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// GET transactions
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
        const type = searchParams.get('type') // 'sent' or 'received' or 'all'

        let where: any = {}

        if (type === 'sent') {
            where.senderId = userId
        } else if (type === 'received') {
            where.receiverId = userId
        } else {
            where.OR = [
                { senderId: userId },
                { receiverId: userId }
            ]
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 100
        })

        return NextResponse.json({ transactions }, { status: 200 })
    } catch (error) {
        console.error('❌ GET TRANSACTIONS ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch transactions' },
            { status: 500 }
        )
    }
}

// POST - Create transaction
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
        const {
            amount,
            type,
            receiverId,
            description,
            reference,
            metadata
        } = body

        if (!amount || !type) {
            return NextResponse.json({ error: 'Amount and type required' }, { status: 400 })
        }

        // Create transaction
        const transaction = await prisma.transaction.create({
            data: {
                amount,
                type,
                senderId: userId,
                receiverId,
                description,
                reference: reference || `TXN-${Date.now()}`,
                status: 'COMPLETED',
                metadata
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        // Update wallets
        if (receiverId) {
            // Deduct from sender
            await prisma.wallet.update({
                where: { userId },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            })

            // Add to receiver
            await prisma.wallet.upsert({
                where: { userId: receiverId },
                create: {
                    userId: receiverId,
                    balance: amount,
                    currency: 'OMR'
                },
                update: {
                    balance: {
                        increment: amount
                    }
                }
            })
        }

        return NextResponse.json(transaction, { status: 201 })
    } catch (error) {
        console.error('❌ CREATE TRANSACTION ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to create transaction' },
            { status: 500 }
        )
    }
}

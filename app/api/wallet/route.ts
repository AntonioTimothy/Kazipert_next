import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

// GET wallet balance and info
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

        // Get or create wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId }
        })

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    currency: 'OMR'
                }
            })
        }

        return NextResponse.json(wallet, { status: 200 })
    } catch (error) {
        console.error('❌ GET WALLET ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch wallet' },
            { status: 500 }
        )
    }
}

// POST - Credit/Debit wallet
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
        const { amount, type, description } = body

        if (!amount || !type) {
            return NextResponse.json({ error: 'Amount and type required' }, { status: 400 })
        }

        // Get wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId }
        })

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: {
                    userId,
                    balance: 0,
                    currency: 'OMR'
                }
            })
        }

        // Calculate new balance
        const newBalance = type === 'CREDIT'
            ? wallet.balance + amount
            : wallet.balance - amount

        if (newBalance < 0) {
            return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
        }

        // Update wallet
        const updatedWallet = await prisma.wallet.update({
            where: { userId },
            data: { balance: newBalance }
        })

        return NextResponse.json(updatedWallet, { status: 200 })
    } catch (error) {
        console.error('❌ UPDATE WALLET ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to update wallet' },
            { status: 500 }
        )
    }
}

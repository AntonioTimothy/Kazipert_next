import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/auth'

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

        // Find the user's contract (employee side)
        const contract = await prisma.contract.findFirst({
            where: {
                employeeId: userId
            },
            include: {
                employer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        profile: {
                            select: {
                                address: true
                            }
                        }
                    }
                },
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                },
                application: {
                    include: {
                        job: {
                            select: {
                                title: true,
                                salary: true,
                                salaryCurrency: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        if (!contract) {
            return NextResponse.json({ contract: null }, { status: 200 })
        }

        return NextResponse.json(contract, { status: 200 })
    } catch (error) {
        console.error('❌ GET MY CONTRACT ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contract' },
            { status: 500 }
        )
    }
}

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
        const userRole = decoded.role

        let contracts

        if (userRole === 'EMPLOYER') {
            // Fetch all contracts for this employer
            contracts = await prisma.contract.findMany({
                where: {
                    employerId: userId
                },
                include: {
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            phone: true,
                            profile: {
                                select: {
                                    avatar: true
                                }
                            }
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
        } else if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
            // Fetch all contracts (admin view)
            contracts = await prisma.contract.findMany({
                include: {
                    employer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            company: true
                        }
                    },
                    employee: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
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
        } else {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json({ contracts }, { status: 200 })
    } catch (error) {
        console.error('❌ GET CONTRACTS ERROR:', error)
        return NextResponse.json(
            { error: 'Failed to fetch contracts' },
            { status: 500 }
        )
    }
}

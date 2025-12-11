import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        const skip = (page - 1) * limit

        const where: any = {}

        if (status && status !== 'all') {
            where.status = status
        }

        if (search) {
            where.OR = [
                { id: { contains: search, mode: 'insensitive' } },
                {
                    application: {
                        job: {
                            title: { contains: search, mode: 'insensitive' }
                        }
                    }
                },
                {
                    employer: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { company: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
                {
                    employee: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ]
        }

        const [contracts, total] = await Promise.all([
            prisma.contract.findMany({
                where,
                include: {
                    application: {
                        select: {
                            id: true,
                            job: {
                                select: {
                                    id: true,
                                    title: true,
                                    employer: {
                                        select: {
                                            id: true,
                                            firstName: true,
                                            lastName: true,
                                            company: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    employer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            company: true
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
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.contract.count({ where })
        ])

        const formattedContracts = contracts.map(contract => ({
            ...contract,
            job: contract.application.job, // Map job from application
            contractNumber: contract.id.substring(0, 8).toUpperCase(),
            benefits: [],
            responsibilities: [],
            duration: '24 months', // Default duration
            salary: contract.application.job.salary || 0,
            salaryCurrency: contract.application.job.salaryCurrency || 'OMR',
            location: contract.application.job.location || contract.application.job.city,
            startDate: contract.createdAt,
            endDate: new Date(new Date(contract.createdAt).setFullYear(new Date(contract.createdAt).getFullYear() + 2)),
            signedAt: contract.employeeSigned && contract.employerSigned ? contract.employeeSignedAt : null
        }))

        return NextResponse.json({
            contracts: formattedContracts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching admin contracts:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

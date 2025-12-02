import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const status = searchParams.get('status')
        const search = searchParams.get('search')
        const type = searchParams.get('type')

        const skip = (page - 1) * limit

        const where: any = {}

        if (status && status !== 'all') {
            where.status = status
        }

        if (type && type !== 'all') {
            where.type = type
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
                {
                    employer: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { company: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                }
            ]
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    employer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            company: true,
                            email: true
                        }
                    },
                    _count: {
                        select: { applications: true }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.job.count({ where })
        ])

        const formattedJobs = jobs.map(job => ({
            ...job,
            applicationsCount: job._count.applications
        }))

        return NextResponse.json({
            jobs: formattedJobs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.error('Error fetching admin jobs:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

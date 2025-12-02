import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const configs = await prisma.salaryConfig.findMany()

        // Convert array to object for easier frontend consumption
        const configMap = configs.reduce((acc, curr) => {
            acc[curr.key] = curr.value
            return acc
        }, {} as Record<string, number>)

        return NextResponse.json(configMap)
    } catch (error) {
        console.error('Error fetching salary config:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const updates = Object.entries(body)

        const results = await Promise.all(
            updates.map(async ([key, value]) => {
                return prisma.salaryConfig.upsert({
                    where: { key },
                    update: { value: Number(value) },
                    create: {
                        key,
                        value: Number(value),
                        description: `Configuration for ${key}`
                    }
                })
            })
        )

        return NextResponse.json({ success: true, updated: results.length })
    } catch (error) {
        console.error('Error updating salary config:', error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

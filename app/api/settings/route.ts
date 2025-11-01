import { NextRequest, NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
// import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        // const session = await getServerSession(authOptions)

        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        // const settings = await prisma.systemSettings.findUnique({
        //     where: { userId: session.user.id }
        // })

        // const profile = await prisma.profile.findUnique({
        //     where: { userId: session.user.id }
        // })

        return NextResponse.json({
            profile: {},
            systemSettings:  {}
        })
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions)

        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { theme, language, currency, notifications, workingHours } = body

        // Update profile settings
        if (theme || language || currency || notifications) {
            await prisma.profile.upsert({
                where: { userId: session.user.id },
                create: {
                    userId: session.user.id,
                    theme,
                    language,
                    currency,
                    notifications
                },
                update: {
                    ...(theme && { theme }),
                    ...(language && { language }),
                    ...(currency && { currency }),
                    ...(notifications && { notifications })
                }
            })
        }

        // Update system settings
        if (workingHours) {
            await prisma.systemSettings.upsert({
                where: { userId: session.user.id },
                create: {
                    userId: session.user.id,
                    workingHours
                },
                update: {
                    workingHours
                }
            })
        }

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully'
        })
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
    }
}
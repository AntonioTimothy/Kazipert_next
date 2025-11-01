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

        const user = await prisma.user.findUnique({
            where: { id: "session.user.id" },
            include: {
                profile: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: user.id,
            email: user.email,
            phone: user.phone,
            fullName: user.fullName,
            firstName: user.firstName,
            lastName: user.lastName,
            company: user.company,
            role: user.role,
            profile: user.profile
        })
    } catch (error) {
        console.error('Error fetching profile:', error)
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions)

        // if (!session) {
        //     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        // }

        const body = await request.json()
        const { firstName, lastName, phone, company, bio, avatar } = body

        const user = await prisma.user.update({
            where: { id: "session.user.id"},
            data: {
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                phone,
                company,
                profile: {
                    upsert: {
                        create: {
                            bio,
                            avatar
                        },
                        update: {
                            bio,
                            avatar
                        }
                    }
                }
            },
            include: {
                profile: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                company: user.company,
                profile: user.profile
            }
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }
}
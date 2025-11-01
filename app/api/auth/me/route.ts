// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getAccessToken, refreshAccessToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
    try {
        let accessToken = await getAccessToken()

        // Try to refresh token if needed
        if (!accessToken) {
            accessToken = await refreshAccessToken()
            if (!accessToken) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        // Verify the token
        const payload = verifyToken(accessToken)

        // Fetch user data from your database
        // This is just an example - replace with your actual user fetching logic
        const user = await fetchUserFromDatabase(payload.userId)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }
// TODO: to chage ony return required fields to avoid sending sensitive data
        return NextResponse.json(user)
    } catch (error) {
        console.error('Failed to fetch user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

async function fetchUserFromDatabase(userId: string) {
    // Replace this with your actual database query
    // Example using Prisma:
    // return await prisma.user.findUnique({ where: { id: userId } })

    return {
        id: userId,
        email: 'user@example.com',
        role: 'worker',
        name: 'John Doe'
    }
}
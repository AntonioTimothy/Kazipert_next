// app/api/verification/upload/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { cookies } from 'next/headers'
import { verifyAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Helper function to get user from request
async function getUserFromRequest(request: NextRequest) {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get('access_token')?.value

        if (!accessToken) {
            return null
        }

        const decoded = verifyAccessToken(accessToken)
        if (!decoded) {
            return null
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        })

        return user
    } catch (error) {
        console.error('Error getting user from request:', error)
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request)
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const fileType = formData.get('fileType') as string

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'verification', user.id)
        if (!existsSync(uploadsDir)) {
            await mkdir(uploadsDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const fileExtension = file.name.split('.').pop()
        const fileName = `${fileType}_${timestamp}.${fileExtension}`
        const filePath = join(uploadsDir, fileName)

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Return relative file URL
        const fileUrl = `/uploads/verification/${user.id}/${fileName}`

        // Update KYC details with file URL
        if (fileType === 'idFront') {
            await prisma.kycDetails.upsert({
                where: { userId: user.id },
                update: { idDocumentFront: fileUrl },
                create: { userId: user.id, idDocumentFront: fileUrl }
            })
        } else if (fileType === 'idBack') {
            await prisma.kycDetails.upsert({
                where: { userId: user.id },
                update: { idDocumentBack: fileUrl },
                create: { userId: user.id, idDocumentBack: fileUrl }
            })
        } else if (fileType === 'selfie') {
            await prisma.kycDetails.upsert({
                where: { userId: user.id },
                update: { profilePicture: fileUrl },
                create: { userId: user.id, profilePicture: fileUrl }
            })
        }

        return NextResponse.json({
            success: true,
            fileUrl,
            message: 'File uploaded successfully'
        })
    } catch (error) {
        console.error('Error uploading file:', error)
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        )
    }
}
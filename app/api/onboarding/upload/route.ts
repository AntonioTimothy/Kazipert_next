import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

async function getCurrentUser(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value ||
            request.headers.get('authorization')?.replace('Bearer ', '')

        if (!token) {
            return null
        }

        // Your actual user verification logic here
        // For now, we'll extract from form data
        return null // Will get from form data instead
    } catch (error) {
        return null
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const userId = formData.get('userId') as string
        const documentType = formData.get('documentType') as string

        if (!file || !userId) {
            return NextResponse.json({ error: 'Missing file or userId' }, { status: 400 })
        }

        // Verify the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate a unique file name
        const timestamp = Date.now()
        const fileExtension = path.extname(file.name)
        const fileName = `${documentType}_${timestamp}${fileExtension}`

        // Create upload directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', userId)
        await mkdir(uploadDir, { recursive: true })

        // Write the file
        const filePath = path.join(uploadDir, fileName)
        await writeFile(filePath, buffer)

        // Return the file URL that uses our API route
        const fileUrl = `/api/uploads/${userId}/${fileName}`

        // Update the onboarding progress with the new file URL
        const progress = await prisma.onboardingProgress.findUnique({
            where: { userId }
        })

        if (progress && progress.data) {
            const currentData = progress.data as any

            const documentPropertyMap: { [key: string]: string } = {
                'profilePicture': 'profilePicture',
                'idDocumentFront': 'idDocumentFront',
                'idDocumentBack': 'idDocumentBack',
                'passport': 'passportDocument',
                'kra': 'kraDocument',
                'goodConduct': 'goodConductUrl',
                'medical': 'medicalDocument'
            }

            const documentProperty = documentPropertyMap[documentType]

            if (documentProperty) {
                const updatedData = {
                    ...currentData,
                    documents: {
                        ...currentData.documents,
                        [documentProperty]: fileUrl
                    }
                }

                await prisma.onboardingProgress.update({
                    where: { userId },
                    data: {
                        data: updatedData
                    }
                })
            }
        }

        return NextResponse.json({
            success: true,
            fileUrl,
            fileName
        })

    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
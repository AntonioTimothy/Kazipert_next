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
        console.log('📥 Upload API called')

        const user = await getUserFromRequest(request)
        if (!user) {
            console.log('❌ No user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('✅ User authenticated:', user.email)

        // WORKAROUND: Clone the request to avoid body lock issues
        // This is necessary because proxy.ts may have touched the original request
        let formData;
        try {
            // Try to read formData from cloned request
            const clonedRequest = request.clone()
            formData = await clonedRequest.formData()
            console.log('✅ FormData parsed from cloned request')
        } catch (cloneError) {
            console.log('⚠️ Clone failed, trying original request')
            try {
                formData = await request.formData()
                console.log('✅ FormData parsed from original request')
            } catch (originalError: any) {
                console.error('❌ Both attempts failed:', originalError.message)
                return NextResponse.json({
                    error: 'Failed to parse form data',
                    details: originalError.message
                }, { status: 500 })
            }
        }

        const file = formData.get('file') as File
        const fileType = formData.get('fileType') as string

        console.log('📄 File info:', {
            hasFile: !!file,
            fileType,
            fileName: file?.name,
            fileSize: file?.size
        })

        if (!file) {
            console.log('❌ No file in form data')
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), 'public', 'uploads', 'verification', user.id)
        console.log('📂 Upload directory:', uploadsDir)

        try {
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true })
                console.log('✅ Directory created')
            }
        } catch (mkdirError) {
            console.error('❌ Error creating directory:', mkdirError)
            return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const fileExtension = file.name.split('.').pop()
        const fileName = `${fileType}_${timestamp}.${fileExtension}`
        const filePath = join(uploadsDir, fileName)
        console.log('📝 Saving to:', filePath)

        // Convert file to buffer and save
        try {
            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(filePath, buffer)
            console.log('✅ File saved successfully')
        } catch (writeError) {
            console.error('❌ Error writing file:', writeError)
            return NextResponse.json({ error: 'Failed to write file' }, { status: 500 })
        }

        // Return relative file URL
        const fileUrl = `/uploads/verification/${user.id}/${fileName}`
        console.log('✅ File URL:', fileUrl)

        // Update KYC details with file URL
        if (fileType === 'idFront') {
            await prisma.kycDetails.upsert({
                where: { userId: user.id },
                update: { idDocumentFront: fileUrl },
                create: { userId: user.id, idDocumentFront: fileUrl }
            })

            const progress = await prisma.onboardingProgress.findUnique({ where: { userId: user.id } })
            const currentData = (progress?.data as any) || {}
            await prisma.onboardingProgress.upsert({
                where: { userId: user.id },
                update: {
                    data: { ...currentData, idFrontPath: fileUrl }
                },
                create: {
                    userId: user.id,
                    data: { idFrontPath: fileUrl }
                }
            })
        } else if (fileType === 'idBack') {
            await prisma.kycDetails.upsert({
                where: { userId: user.id },
                update: { idDocumentBack: fileUrl },
                create: { userId: user.id, idDocumentBack: fileUrl }
            })

            const progress = await prisma.onboardingProgress.findUnique({ where: { userId: user.id } })
            const currentData = (progress?.data as any) || {}
            await prisma.onboardingProgress.upsert({
                where: { userId: user.id },
                update: {
                    data: { ...currentData, idBackPath: fileUrl }
                },
                create: {
                    userId: user.id,
                    data: { idBackPath: fileUrl }
                }
            })
        } else if (fileType === 'selfie') {
            await prisma.kycDetails.upsert({
                where: { userId: user.id },
                update: { selfieUrl: fileUrl },
                create: { userId: user.id, selfieUrl: fileUrl }
            })

            const progress = await prisma.onboardingProgress.findUnique({ where: { userId: user.id } })
            const currentData = (progress?.data as any) || {}
            await prisma.onboardingProgress.upsert({
                where: { userId: user.id },
                update: {
                    data: { ...currentData, selfiePath: fileUrl }
                },
                create: {
                    userId: user.id,
                    data: { selfiePath: fileUrl }
                }
            })
        }

        console.log('✅ Upload complete')
        return NextResponse.json({
            success: true,
            fileUrl,
            message: 'File uploaded successfully'
        })
    } catch (error: any) {
        console.error('❌ Upload error:', error)
        console.error('Stack:', error.stack)
        return NextResponse.json(
            { error: 'Failed to upload file', details: error.message },
            { status: 500 }
        )
    }
}
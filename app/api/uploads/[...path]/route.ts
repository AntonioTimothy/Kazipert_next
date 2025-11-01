import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const { path: pathArray } = params
        const filePath = path.join(process.cwd(), 'public', 'uploads', ...pathArray)

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse('File not found', { status: 404 })
        }

        // Read the file
        const fileBuffer = fs.readFileSync(filePath)
        const fileExtension = path.extname(filePath).toLowerCase()

        // Set appropriate content type
        const contentTypes: { [key: string]: string } = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.pdf': 'application/pdf',
        }

        const contentType = contentTypes[fileExtension] || 'application/octet-stream'

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
            },
        })
    } catch (error) {
        console.error('File serve error:', error)
        return new NextResponse('Internal server error', { status: 500 })
    }
}
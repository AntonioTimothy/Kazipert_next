// app/api/verification/upload-id-back/route.ts - NODE.JS RUNTIME
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

const OCR_MICROSERVICE_URL = "http://localhost:3003";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    console.log('🎯 UPLOAD ID BACK API CALLED (Node.js Runtime)');

    try {
        const formData = await request.formData();
        const file = formData.get("idBack") as File;
        const sessionId = formData.get("sessionId") as string;

        console.log('📋 Received:', {
            hasFile: !!file,
            fileName: file?.name,
            fileSize: file?.size,
            sessionId: sessionId
        });

        if (!file || !sessionId) {
            return NextResponse.json({ error: "Missing file or sessionId" }, { status: 400 });
        }

        // Convert File to Buffer
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const microserviceFormData = new FormData();
        microserviceFormData.append("sessionId", sessionId);
        microserviceFormData.append("idBack", new File([fileBuffer], file.name, {
            type: file.type || 'image/jpeg'
        }));

        console.log('🔄 Forwarding to microservice...');

        const response = await axios.post(`${OCR_MICROSERVICE_URL}/upload-id-back`, microserviceFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000, // Longer timeout for file uploads
        });

        console.log('📨 Microservice response status:', response.status);
        console.log('✅ Upload successful');

        return NextResponse.json(response.data);

    } catch (error: any) {
        console.error('💥 Upload error:', error);

        if (error.code === 'ECONNREFUSED') {
            return NextResponse.json(
                { error: 'OCR microservice is unavailable' },
                { status: 503 }
            );
        }

        if (error.response) {
            // The microservice responded with an error status
            return NextResponse.json(
                { error: error.response.data },
                { status: error.response.status }
            );
        } else if (error.request) {
            // Request was made but no response received
            return NextResponse.json(
                { error: 'No response from OCR microservice' },
                { status: 502 }
            );
        } else {
            // Something else went wrong
            return NextResponse.json(
                { error: 'Upload failed: ' + error.message },
                { status: 500 }
            );
        }
    }
}
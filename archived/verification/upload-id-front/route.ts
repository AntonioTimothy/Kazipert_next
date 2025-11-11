// app/api/verification/upload-id-front/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const OCR_MICROSERVICE_URL = 'http://localhost:3003';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // For file uploads, keep as FormData but ensure proper headers
    const response = await axios.post(`${OCR_MICROSERVICE_URL}/upload-id-front`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Important for file uploads
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000, // Longer timeout for file uploads
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Error handling as above
  }
}
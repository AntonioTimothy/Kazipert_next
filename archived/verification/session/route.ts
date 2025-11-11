// app/api/verification/session/route.ts - NODE.JS RUNTIME
import { NextResponse } from "next/server";

const OCR_MICROSERVICE_URL = "http://localhost:3003";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
    console.log('🎯 CREATE SESSION API CALLED (Node.js Runtime)');

    try {
        console.log('🔄 Creating session with microservice...');

        const response = await fetch(`${OCR_MICROSERVICE_URL}/create-session`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log('📨 Microservice response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: errorText }, { status: response.status });
        }

        const result = await response.json();
        console.log('✅ Session created:', result.sessionId);
        return NextResponse.json(result);

    } catch (err: any) {
        console.error('💥 Session creation error:', err);
        return NextResponse.json(
            { error: "Session creation failed: " + err?.message },
            { status: 500 }
        );
    }
}
// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import crypto from "crypto";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const token = crypto.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpires: expires },
        });

        const resetLink = `${BASE_URL}/reset-password/${token}`;
        // Print reset link to console (simulate email)
        console.log(`[FORGOT] Reset link for ${email}: ${resetLink} (expires ${expires.toISOString()})`);

        return NextResponse.json({ success: true, message: "Reset link sent (console)" });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

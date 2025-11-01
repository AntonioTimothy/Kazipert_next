// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();
        if (!email || !otp) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

        if (user.otp !== otp) return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        if (user.otpExpires && new Date() > new Date(user.otpExpires)) {
            return NextResponse.json({ error: "OTP expired" }, { status: 400 });
        }

        // clear OTP, mark verified
        await prisma.user.update({
            where: { email },
            data: { otp: null, otpExpires: null, verified: true },
        });

        // generate JWT
        const token = jwt.sign({ userId: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

        const res = NextResponse.json({ success: true, role: user.role });
        // set cookie
        res.cookies.set("token", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
        return res;
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

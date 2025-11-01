// app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();
        if (!token || !newPassword) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const user = await prisma.user.findFirst({ where: { resetToken: token } });
        if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        if (!user.resetTokenExpires || new Date() > new Date(user.resetTokenExpires)) {
            return NextResponse.json({ error: "Token expired" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed, resetToken: null, resetTokenExpires: null },
        });

        return NextResponse.json({ success: true, message: "Password updated" });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

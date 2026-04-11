import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { VerifyToken, SignToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "No token." }, { status: 401 });
        }

        const decoded = await VerifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId as number },
            select: { id: true, role: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 401 });
        }

        const newToken = await SignToken({ userId: user.id, role: user.role });
        cookieStore.set("token", newToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
        });

        return NextResponse.json({ message: "Token refreshed." });
    } catch {
        return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { VerifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserFromToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return null;
    }

    try {
        const decoded = await VerifyToken(token);
        return prisma.user.findUnique({
            where: { id: decoded.userId as number },
            select: { id: true, name: true, email: true, role: true },
        });
    } catch {
        return null;
    }
}

export async function GET() {
    try {
        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

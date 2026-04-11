import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
import { z } from "zod";

const updateUserSchema = z.object({
    role: z.enum(["USER", "ADMIN"]).optional(),
    name: z.string().min(2).optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
        }

        const body = await req.json();
        const parsed = updateUserSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: parsed.data,
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(user);
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) {
            return NextResponse.json({ error: "Invalid ID." }, { status: 400 });
        }

        if (currentUser.id === id) {
            return NextResponse.json({ error: "You can't remove it." }, { status: 400 });
        }

        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ message: "User deleted." });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
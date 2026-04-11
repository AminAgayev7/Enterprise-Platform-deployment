import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
import { z } from "zod";

const updateOrderSchema = z.object({
    status: z.enum(["PENDING", "PAID", "SHIPPED", "CANCELLED"]),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: { include: { product: { select: { id: true, title: true, price: true } } } },
            },
        });

        if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

        if (currentUser.role !== "ADMIN" && order.userId !== currentUser.id) {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        return NextResponse.json(order);
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }
        const { id: rawId } = await params;
        const id = parseInt(rawId, 10);
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

        const body = await req.json();
        const parsed = updateOrderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status: parsed.data.status },
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: { include: { product: { select: { id: true, title: true } } } },
            },
        });

        return NextResponse.json(order);
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
        await prisma.order.delete({ where: { id } });
        return NextResponse.json({ message: "Order deleted." });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

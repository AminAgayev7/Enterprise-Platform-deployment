import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";
import { z } from "zod";

const createOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
    })).min(1, "At least one item required."),
});

export async function GET(req: NextRequest) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
        const skip = (page - 1) * limit;

        const where = currentUser.role === "ADMIN" ? {} : { userId: currentUser.id };

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                    items: { include: { product: { select: { id: true, title: true, price: true } } } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            orders,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        const body = await req.json();
        const parsed = createOrderSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const { items } = parsed.data;

        const products = await Promise.all(
            items.map(item => prisma.product.findUnique({ where: { id: item.productId } }))
        );

        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (!product) {
                return NextResponse.json({ error: `Product not found: ${items[i].productId}` }, { status: 404 });
            }
            if (product.stock < items[i].quantity) {
                return NextResponse.json({ error: `Insufficient stock for: ${product.title}` }, { status: 400 });
            }
        }

        const total = items.reduce((sum, item, i) => {
            return sum + (products[i]!.price * item.quantity);
        }, 0);

        const order = await prisma.$transaction(async (tx) => {
            for (let i = 0; i < items.length; i++) {
                await tx.product.update({
                    where: { id: items[i].productId },
                    data: { stock: { decrement: items[i].quantity } },
                });
            }

            return tx.order.create({
                data: {
                    userId: currentUser.id,
                    total,
                    status: "PENDING",
                    items: {
                        create: items.map((item, i) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: products[i]!.price,
                        })),
                    },
                },
                include: {
                    items: { include: { product: { select: { id: true, title: true } } } },
                },
            });
        });

        return NextResponse.json(order, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

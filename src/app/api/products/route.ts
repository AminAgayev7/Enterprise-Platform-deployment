import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

const createProductSchema = z.object({
    title: z.string().min(1, "Title can't be omitted"),
    description: z.string().optional(),
    price: z.number().positive("Price should be positive"),
    stock: z.number().int().min(0, "Stock can't be negative"),
});

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)));
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.product.count(),
        ]);

        return NextResponse.json({
            products,
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
        const body = await req.json();
        const parsed = createProductSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }
        const product = await prisma.product.create({ data: parsed.data });
        return NextResponse.json(product, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

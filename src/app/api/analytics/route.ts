import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/auth/me/route";

export async function GET() {
    try {
        const currentUser = await getUserFromToken();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Not authorized." }, { status: 403 });
        }

        const [totalUsers, totalProducts, totalOrders, recentOrders, lowStockProducts, ordersByStatus] = 
        
        await Promise.all([
            prisma.user.count(),
            prisma.product.count(),
            prisma.order.count(),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { user: { select: { name: true, email: true } } },
            }),
            prisma.product.findMany({
                where: { stock: { lte: 5 } },
                orderBy: { stock: "asc" },
                take: 5,
            }),
            prisma.order.groupBy({
                by: ["status"],
                _count: { status: true },
            }),
        ]);

        const totalRevenue = await prisma.order.aggregate({
            _sum: { total: true },
            where: { status: "PAID" },
        });

        return NextResponse.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue._sum.total ?? 0,
            recentOrders,
            lowStockProducts,
            ordersByStatus,
        });
    } catch {
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}
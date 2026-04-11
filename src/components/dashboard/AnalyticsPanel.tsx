"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import StatCard from "./StatCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Order } from "@/lib/types";
export default function AnalyticsPanel() {
    const { analytics, isLoading, isError } = useAnalytics();

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (isError) {
        return <ErrorMessage message="Analytics not loaded." />;
    }
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Total User" value={analytics.totalUsers} />
                <StatCard title="Total Product" value={analytics.totalProducts} />
                <StatCard title="Total Order" value={analytics.totalOrders} />
                <StatCard
                    title="Total Revenue"
                    value={`$${analytics.totalRevenue.toFixed(2)}`}
                    sub="Only paid orders"
                />
            </div>


            {analytics.lowStockProducts.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 text-orange-600">Products with low stock</h3>
                    <div className="flex flex-col gap-2">
                        {analytics.lowStockProducts.map((p: any) => (
                            <div key={p.id} className="flex justify-between border rounded-xl px-4 py-2 text-sm">
                                <span>{p.title}</span>
                                <span className="text-orange-500 font-medium">Stock: {p.stock}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            <div>
                <h3 className="font-semibold mb-2">Last Orders</h3>
                {
                    analytics?.recentOrders?.length > 0 ? <div className="flex flex-col gap-2">
                    {analytics.recentOrders.map((o: Order) => (
                        <div key={o.id} className="flex justify-between border rounded-xl px-4 py-2 text-sm">
                            <span>{o.user?.name}</span>
                            <span>${o.total.toFixed(2)}</span>
                            <span className={`font-medium ${o.status === "PAID" ? "text-green-500" :
                                o.status === "CANCELLED" ? "text-red-500" :
                                    "text-yellow-500"
                                }`}>
                                {o.status}
                            </span>
                        </div>
                    ))}
                </div> : <p className="text-gray-500">Last Orders shown here.</p>
                }
            </div>


            <div>
                <h3 className="font-semibold mb-2">Order statuses</h3>
                {
                    analytics?.ordersByStatus?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {analytics.ordersByStatus.map((s: any) => (
                                <div
                                    key={s.status}
                                    className="border rounded-xl px-4 py-3 text-center text-sm"
                                >
                                    <p className="font-semibold">
                                        {s._count.status}
                                    </p>

                                    <p className="text-gray-500">
                                        {s.status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Order statuses shown here.
                        </p>
                    )
                }
            </div>
        </div>
    );
}
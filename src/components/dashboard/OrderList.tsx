"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/lib/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/ui/Pagination";
import { Order } from "@/lib/types";
const STATUS_COLORS: Record<string, string> = {
    PENDING: "text-yellow-500",
    PAID: "text-green-500",
    SHIPPED: "text-blue-500",
    CANCELLED: "text-red-500",
};

const STATUSES = ["PENDING", "PAID", "SHIPPED", "CANCELLED"];

export default function OrderList() {
    const [page, setPage] = useState(1);
    const { user } = useAuth();
    const { orders, totalPages, isLoading, isError, mutate, updateStatusOptimistic } = useOrders(page);

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (isError) {
        return <ErrorMessage message="Orders not loaded." onRetry={mutate} />;
    }
    if (orders.length === 0) {
        return <p className="text-gray-400 text-sm">No orders yet.</p>;
    }
    return (
        <div className="flex flex-col gap-2">
            {orders.map((o: Order) => (
                <div key={o.id} className="border rounded-xl px-4 py-3 text-sm flex flex-col gap-1 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Order #{o.id}</span>
                        <span className={`font-semibold ${STATUS_COLORS[o.status] ?? ""}`}>
                            {o.status}
                        </span>
                    </div>
                    <div className="text-gray-500 flex justify-between flex-wrap gap-2">
                        <span>{o.user?.name} — {o.user?.email}</span>
                        <span className="font-medium text-gray-700">${o.total.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-400 text-xs">
                        {o.items?.map((item: any) => (
                            <span key={item.id} className="mr-2">
                                {item.product?.title} x{item.quantity}
                            </span>
                        ))}
                    </div>
                    {user?.role === "ADMIN" && (
                        <div className="flex gap-2 mt-1 flex-wrap">
                            {STATUSES.filter(s => s !== o.status).map(s => (
                                <button
                                    key={s}
                                    onClick={() => updateStatusOptimistic(o.id, s)}
                                    className="text-xs border rounded-lg px-2 py-0.5 hover:bg-gray-100 transition"
                                >
                                    → {s}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

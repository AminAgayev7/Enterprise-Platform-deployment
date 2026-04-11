"use client";

import { useAuth } from "@/lib/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AnalyticsPanel from "@/components/dashboard/AnalyticsPanel";
import ProductList from "@/components/dashboard/ProductList";
import OrderList from "@/components/dashboard/OrderList";
import UserList from "@/components/dashboard/UserList";
import ProductForm from "@/components/forms/ProductForm";
import OrderForm from "@/components/forms/OrderForm";

export default function DashBoard() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="p-6 text-gray-400">Loading...</div>;
    }
    return (
        <ProtectedRoute>
            <div className="p-6 justify-center mx-auto flex flex-col gap-8 w-full">

                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 text-sm">{user?.name} — {user?.email}</p>
                </div>

                {user?.role === "ADMIN" && (
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
                        <AnalyticsPanel />
                    </section>
                )}

                {user?.role === "ADMIN" && (
                    <section className="flex flex-col justify-center items-center">
                        <h2 className="text-lg font-semibold mb-4">New Product</h2>
                        <ProductForm />
                    </section>
                )}

                <section>
                    <h2 className="text-lg font-semibold mb-4">Products</h2>
                    <ProductList />
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-4">Place an Order</h2>
                    <OrderForm />
                </section>

                <section>
                    <h2 className="text-lg font-semibold mb-4">Orders</h2>
                    <OrderList />
                </section>

                {user?.role === "ADMIN" && (
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Users</h2>
                        <UserList />
                    </section>
                )}

            </div>
        </ProtectedRoute>
    );
}

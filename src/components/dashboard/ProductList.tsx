"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/lib/contexts/AuthContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Pagination from "@/components/ui/Pagination";
import Link from "next/link";
import { Product } from "@/lib/types";
export default function ProductList() {
    const [page, setPage] = useState(1);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<any>({});
    const { user } = useAuth();

    const { products, totalPages, isLoading, isError, mutate, deleteProduct, updateProduct } = useProducts(page);

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (isError) {
        return <ErrorMessage message="Products not loaded." onRetry={mutate} />;
    }
    if (products.length === 0) {
        return <p className="text-gray-400 text-sm">No products yet.</p>;
    }
    function startEdit(p: Product) {
        setEditingId(p.id);
        setEditValues({ title: p.title, price: p.price, stock: p.stock });
    }

    async function saveEdit(id: number) {
        await updateProduct(id, {
            title: editValues.title,
            price: parseFloat(editValues.price),
            stock: parseInt(editValues.stock),
        });
        setEditingId(null);
    }

    return (
        <div className="flex flex-col gap-2">
            {products.map((p: Product) => (
                <div key={p.id} className="flex justify-between items-center border rounded-xl px-4 py-3 text-sm hover:bg-gray-50 transition gap-4">
                    {editingId === p.id ? (
                        <div className="flex gap-2 flex-1 flex-wrap">
                            <input
                                className="border rounded-lg px-2 py-1 text-sm w-32"
                                value={editValues.title}
                                onChange={e => setEditValues({ ...editValues, title: e.target.value })}
                            />
                            <input
                                className="border rounded-lg px-2 py-1 text-sm w-20"
                                type="number"
                                value={editValues.price}
                                onChange={e => setEditValues({ ...editValues, price: e.target.value })}
                            />
                            <input
                                className="border rounded-lg px-2 py-1 text-sm w-20"
                                type="number"
                                value={editValues.stock}
                                onChange={e => setEditValues({ ...editValues, stock: e.target.value })}
                            />
                            <button onClick={() => saveEdit(p.id)} className="text-green-600 font-medium hover:underline">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:underline">Cancel</button>
                        </div>
                    ) : (
                        <>
                            <Link href={`/products/${p.id}`} className="text-blue-600 hover:underline font-medium flex-1">
                                {p.title}
                            </Link>
                            <div className="flex gap-4 text-gray-500 items-center">
                                <span>${p.price.toFixed(2)}</span>
                                <span className={p.stock <= 5 ? "text-orange-500 font-medium" : ""}>
                                    Stock: {p.stock}
                                </span>
                                {user?.role === "ADMIN" && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(p)}
                                            className="text-blue-500 hover:underline text-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(p.id)}
                                            className="text-red-500 hover:underline text-xs"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ))}
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}

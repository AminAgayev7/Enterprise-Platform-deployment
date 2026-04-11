"use client";
import { Product } from "@/lib/types";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type CartItem = {
    productId: number;
    title: string;
    price: number;
    quantity: number;
};

export default function OrderForm() {
    const { products, isLoading } = useProducts(1, 50);
    const { mutate } = useOrders();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    function addToCart(product: Product) {
        setCart(prev => {
            const exists = prev.find((i) => i.productId === product.id);
            if (exists) {
                return prev.map((i) =>
                    i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { productId: product.id, title: product.title, price: product.price, quantity: 1 }];
        });
    }

    function removeFromCart(productId: number) {
        setCart(prev => prev.filter((i) => i.productId !== productId));
    }

    function changeQty(productId: number, qty: number) {
        if (qty < 1) {
            return removeFromCart(productId);
        }
        setCart(prev => prev.map((i) => i.productId === productId ? { ...i, quantity: qty } : i));
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    async function submitOrder() {
        if (cart.length === 0) {
            return;
        }
        setIsPending(true);
        setMessage(null);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: cart.map(i => ({ productId: i.productId, quantity: i.quantity })) }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage({ type: "error", text: data.error ?? "Order failed." });
            } else {
                setMessage({ type: "success", text: "Order placed successfully!" });
                setCart([]);
                mutate();
            }
        } catch {
            setMessage({ type: "error", text: "Network error." });
        } finally {
            setIsPending(false);
        }
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <div className="flex flex-col gap-4 ">
            {message && (
                <p className={`text-sm ${message.type === "success" ? "text-green-500" : "text-red-500"}`}>
                    {message.text}
                </p>
            )}

            <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-500 font-medium">Select products:</p>
                {products.map((p: Product) => (
                    <div key={p.id} className="flex justify-between items-center border rounded-xl px-4 py-2 text-sm">
                        <span>{p.title} — <span className="text-gray-500">${p.price.toFixed(2)}</span></span>
                        <button
                            onClick={() => addToCart(p)}
                            disabled={p.stock === 0}
                            className="text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline text-xs font-medium"
                        >
                            {p.stock === 0 ? "Out of stock" : "+ Add"}
                        </button>
                    </div>
                ))}
            </div>

            {cart.length > 0 && (
                <div className="border rounded-xl p-4 flex flex-col gap-3">
                    <p className="font-semibold text-sm">Cart:</p>
                    {cart.map(item => (
                        <div key={item.productId} className="flex justify-between items-center text-sm gap-2">
                            <span className="flex-1">{item.title}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => changeQty(item.productId, item.quantity - 1)} className="border rounded px-2">−</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => changeQty(item.productId, item.quantity + 1)} className="border rounded px-2">+</button>
                            </div>
                            <span className="text-gray-500 w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                        </div>
                    ))}
                    <div className="flex justify-between font-semibold text-sm border-t pt-2">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={submitOrder}
                        disabled={isPending}
                        className="bg-blue-600 text-white font-semibold rounded-xl py-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                        {isPending ? "Placing order..." : "Place Order"}
                    </button>
                </div>
            )}
        </div>
    );
}

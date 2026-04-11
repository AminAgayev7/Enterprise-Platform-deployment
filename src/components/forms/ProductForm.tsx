"use client";

import { useActionState } from "react";
import { createProductAction } from "@/actions/product.actions";
import { useProducts } from "@/hooks/useProducts";
import { useEffect } from "react";
const initialState = { error: ""};

export default function ProductForm() {
    const [state, formAction, isPending] = useActionState(createProductAction, initialState);
    const { mutate } = useProducts();


    useEffect(() => {
        if (state.success) {
            mutate();
        }
    }, [state.success]);
    return (
        <form action={formAction} className="flex flex-col w-full gap-3">

            {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
            )}
            {state.success && (
                <p className="text-green-500 text-sm">{state.success}</p>
            )}

            <input
                name="title"
                placeholder="title"
                required
                className="border rounded-xl px-4 py-2"
            />
            <input
                name="description"
                placeholder="description"
                className="border rounded-xl px-4 py-2"
            />
            <input
                name="price"
                type="number"
                step="0.01"
                placeholder="price"
                required
                className="border rounded-xl px-4 py-2"
            />
            <input
                name="stock"
                type="number"
                placeholder="stock"
                required
                className="border rounded-xl px-4 py-2"
            />

            <button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 text-white font-semibold rounded-xl py-2 hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
                {isPending ? "Adding..." : "Add product"}
            </button>
        </form>
    );
}
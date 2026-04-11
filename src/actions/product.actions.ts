"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
    title: z.string().min(1, "Title can't be omitted."),
    description: z.string().optional(),
    price: z.coerce.number().positive("Price should be positive."),
    stock: z.coerce.number().int().min(0, "Stock can't be negative."),
});

const updateProductSchema = z.object({
    id: z.coerce.number().int().positive(),
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).optional(),
});

export async function createProductAction(prevState: any, formData: FormData) {
    const parsed = productSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    await prisma.product.create({ data: parsed.data });
    revalidatePath("/dashboard");
    return { success: "Product added successfully." };
}

export async function updateProductAction(prevState: any, formData: FormData) {
    const parsed = updateProductSchema.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { id, ...data } = parsed.data;

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return { error: "Product not found." };

    await prisma.product.update({ where: { id }, data });
    revalidatePath("/dashboard");
    return { success: "Product updated." };
}

export async function deleteProductAction(prevState: any, formData: FormData) {
    const id = parseInt(formData.get("id") as string, 10);
    if (isNaN(id)) {
        return { error: "Invalid product ID." };
    }
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
        return { error: "Product not found." };
    }
    await prisma.product.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: "Product deleted." };
}

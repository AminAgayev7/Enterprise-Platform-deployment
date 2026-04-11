"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { SignToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2, "Name should contain at least 2 characters."),
    email: z.string().email("Enter valid email."),
    password: z.string().min(6, "Cipher should contain at least 6 characters."),
});

const loginSchema = z.object({
    email: z.string().email("Enter valid email."),
    password: z.string().min(6, "Cipher should contain at least 6 characters."),
});

export async function registerAction(prevState: any, formData: FormData) {
    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { name, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return { error: "This email is already in use." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: { name, email, password: hashedPassword },
    });

    return { success: "Registration is successful. Now Log in!" };
}

export async function loginAction(prevState: any, formData: FormData) {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues[0].message };
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return { error: "Email or cipher is incorrect." };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return { error: "Email or cipher is incorrect." };
    }

    const token = await SignToken({ userId: user.id, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
        httpOnly: true,
        maxAge: 86400,
    });

    return { success: "Logged in successfully." };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete("token");
}

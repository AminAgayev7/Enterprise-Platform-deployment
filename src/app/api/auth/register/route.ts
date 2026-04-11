import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import { rateLimit } from "@/lib/rateLimit";

const registerSchema = z.object({
    name: z.string().min(2, "Name should contain at least 2 characters."),
    email: z.string().email("Enter valid email address."),
    password: z.string().min(6, "Cipher should contain at least 6 characters"),
});

export async function POST(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (!rateLimit(`register:${ip}`, 3, 60_000)) {
        return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const { name, email, password } = parsed.data;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "This email already is in use." }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        return NextResponse.json(
            { message: "User created.", user: { id: user.id, email: user.email, name: user.name } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}

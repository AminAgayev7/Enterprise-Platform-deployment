import { NextResponse } from "next/server";
import { VerifyToken } from "./src/lib/auth";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        await VerifyToken(token);
        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
}

export const config = {
    matcher: [
        "/((?!auth|_next/static|_next/image|favicon.ico|api/auth).*)",
    ],
};
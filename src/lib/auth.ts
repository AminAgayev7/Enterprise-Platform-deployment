import { SignJWT, jwtVerify } from "jose";

const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    return new TextEncoder().encode(secret);
};

export async function SignToken(payload: object): Promise<string> {
    const secret = getSecret();
    return await new SignJWT(payload as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .sign(secret);
}

export async function VerifyToken(token: string) {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload;
}

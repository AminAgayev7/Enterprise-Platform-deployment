import { PrismaClient } from "../generated/prisma/client";
import path from 'path';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

const dbUrl = `file:${path.resolve(process.cwd(), 'public/projectDb.db')}`;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    datasources: {
        db: {
            url: dbUrl,
        },
    },
});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
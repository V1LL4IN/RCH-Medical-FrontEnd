import { PrismaClient } from '@prisma/client';

// Declare global variable for Prisma Client
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Create a singleton instance - Prisma v7 doesn't need explicit config
// It automatically reads from prisma.config.ts and .env
const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Use global variable to prevent multiple instances in development
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

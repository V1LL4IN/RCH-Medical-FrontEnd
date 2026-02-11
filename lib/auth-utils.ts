import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserRole } from './types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for backend API requests
 */
export function generateBackendToken(userId: string, role: UserRole, email: string): string {
    return jwt.sign(
        {
            userId,
            role,
            email,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
}

/**
 * Verify a JWT token
 */
export function verifyBackendToken(token: string): {
    userId: string;
    role: UserRole;
    email: string;
} | null {
    try {
        return jwt.verify(token, JWT_SECRET) as {
            userId: string;
            role: UserRole;
            email: string;
        };
    } catch {
        return null;
    }
}

import { UserRole } from '@/lib/types';
import type { DefaultSession, DefaultUser } from 'next-auth';
import type { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            status: string;
            membershipActive?: boolean;
            adminId?: string;
            doctorId?: string;
            backendToken: string; // JWT for backend API requests
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role: UserRole;
        status: string;
        membershipActive?: boolean;
        adminId?: string;
        doctorId?: string;
        backendToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        role: UserRole;
        status?: string;
        membershipActive?: boolean;
        adminId?: string;
        doctorId?: string;
        backendToken: string;
    }
}

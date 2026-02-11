import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateBackendToken } from '@/lib/auth-utils';
import type { UserRole } from '@/lib/types';

export const authConfig: NextAuthConfig = {
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                console.log('🔐 Starting authorization with:', { email: credentials?.email });

                if (!credentials?.email || !credentials?.password) {
                    console.log('❌ Missing credentials');
                    return null;
                }

                try {
                    // Query user from database with relations
                    console.log('📊 Querying database for user:', credentials.email);
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email as string },
                        include: {
                            Admin: true,
                            Doctor: {
                                include: {
                                    Specialty: true,
                                },
                            },
                        },
                    });

                    console.log('👤 User found:', user ? { id: user.id, email: user.email, hasPassword: !!user.password } : null);

                    if (!user || !user.password) {
                        console.log('❌ User not found or no password');
                        return null;
                    }

                    // Verify password
                    console.log('🔑 Verifying password...');
                    const isValidPassword = await verifyPassword(
                        credentials.password as string,
                        user.password
                    );

                    console.log('✅ Password valid:', isValidPassword);

                    if (!isValidPassword) {
                        console.log('❌ Invalid password');
                        return null;
                    }

                    // Check user status
                    console.log('📋 Checking user status:', user.status);
                    if (user.status !== 'Activo') {
                        console.log('❌ User not active');
                        throw new Error('Usuario inactivo o suspendido');
                    }

                    // Determine role based on relations
                    let role: UserRole = 'patient';
                    let adminId: string | undefined;
                    let doctorId: string | undefined;

                    if (user.Admin) {
                        role = 'admin';
                        adminId = user.Admin.id;
                    } else if (user.Doctor) {
                        role = 'doctor';
                        doctorId = user.Doctor.id;
                    }

                    console.log('👥 User role determined:', role);

                    // Generate JWT for backend API
                    const backendToken = generateBackendToken(user.id, role, user.email!);
                    console.log('🎫 Backend token generated');

                    const result = {
                        id: user.id,
                        email: user.email!,
                        name: user.name || '',
                        role,
                        status: user.status,
                        adminId,
                        doctorId,
                        backendToken, // JWT for backend requests
                    };

                    console.log('✅ Authorization successful, returning user:', { id: result.id, email: result.email, role: result.role });
                    return result;
                } catch (error) {
                    console.error('❌ Authentication error:', error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Add user data to JWT on sign in
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email!;
                token.name = user.name!;
                token.status = user.status;
                token.membershipActive = user.membershipActive;
                token.adminId = user.adminId;
                token.doctorId = user.doctorId;
                token.backendToken = user.backendToken; // Store backend JWT
            }

            // Allow session updates
            if (trigger === 'update' && session) {
                token.name = session.name;
            }

            return token;
        },
        async session({ session, token }) {
            // Add user data to session
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.status = token.status as string;
                session.user.membershipActive = token.membershipActive as boolean | undefined;
                session.user.adminId = token.adminId as string | undefined;
                session.user.doctorId = token.doctorId as string | undefined;
                session.user.backendToken = token.backendToken as string; // Include backend JWT in session
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnDoctor = nextUrl.pathname.startsWith('/doctor');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');
            const isOnAlly = nextUrl.pathname.startsWith('/aliado');

            // Protected routes
            if (isOnDashboard || isOnDoctor || isOnAdmin || isOnAlly) {
                if (!isLoggedIn) return false;

                // Role-based access control
                const userRole = auth.user.role;
                if (isOnDoctor && userRole !== 'doctor') return false;
                if (isOnAdmin && userRole !== 'admin') return false;
                if (isOnAlly && userRole !== 'ally') return false;

                return true;
            }

            return true;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

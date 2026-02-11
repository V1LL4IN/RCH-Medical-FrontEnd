import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
});

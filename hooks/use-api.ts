'use client';

import { useSession } from 'next-auth/react';

/**
 * Client-side hook for making authenticated API requests
 * Automatically includes JWT token from session
 */
export function useApi() {
    const { data: session } = useSession();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rch-backend-production.up.railway.app';

    const request = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
        const token = session?.user?.backendToken;

        const response = await fetch(`${baseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${response.status}`);
        }

        const json = await response.json();
        // Handle wrapped responses: { data: [...], statusCode, timestamp }
        if (json && typeof json === 'object' && 'data' in json) {
            return json.data as T;
        }
        return json as T;
    };

    return { request, isAuthenticated: !!session };
}

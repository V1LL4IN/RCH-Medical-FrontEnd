import { auth } from '@/auth';

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://rch-backend-production.up.railway.app';
    }

    /**
     * Make an authenticated request to the backend API
     * Automatically includes JWT token from session (server-side only)
     */
    async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const session = await auth();
        const token = session?.user?.backendToken;

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
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
    }

    // Example backend endpoints
    async getDoctors() {
        return this.request('/doctors');
    }

    async getUsers() {
        return this.request('/users');
    }

    async getSpecialties() {
        return this.request('/specialties');
    }

    async createDoctor(data: any) {
        return this.request('/doctors', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new ApiClient();

"use client"

import type {
    ApiDoctor,
    ApiSpecialty,
    ApiUser,
    CreateDoctorDto,
    CreateSpecialtyDto,
    CreateUserDto,
    UpdateDoctorDto,
    UpdateSpecialtyDto,
    UpdateUserDto,
} from "./types"

/**
 * API Client for browser-side requests
 * Uses fetch with credentials and handles JWT token from localStorage/session
 */
class BrowserApiClient {
    private baseUrl: string

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://rch-backend-production.up.railway.app"
    }

    private async getAuthToken(): Promise<string | null> {
        // Get token from session storage or next-auth session
        try {
            const response = await fetch("/api/auth/session")
            const session = await response.json()
            return session?.user?.backendToken || null
        } catch {
            return null
        }
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const token = await this.getAuthToken()

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                ...options?.headers,
            },
            ...options,
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            throw new Error(error.message || `API Error: ${response.status}`)
        }

        const json = await response.json()
        // Handle wrapped responses: { data: [...], statusCode, timestamp }
        if (json && typeof json === 'object' && 'data' in json) {
            return json.data as T
        }
        return json as T
    }

    // ==================
    // Specialties
    // ==================

    async getSpecialties(): Promise<ApiSpecialty[]> {
        return this.request<ApiSpecialty[]>("/specialties")
    }

    async getSpecialtyById(id: string): Promise<ApiSpecialty> {
        return this.request<ApiSpecialty>(`/specialties/${id}`)
    }

    async createSpecialty(data: CreateSpecialtyDto): Promise<ApiSpecialty> {
        return this.request<ApiSpecialty>("/specialties", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateSpecialty(id: string, data: UpdateSpecialtyDto): Promise<ApiSpecialty> {
        return this.request<ApiSpecialty>(`/specialties/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteSpecialty(id: string): Promise<ApiSpecialty> {
        return this.request<ApiSpecialty>(`/specialties/${id}`, {
            method: "DELETE",
        })
    }

    // ==================
    // Doctors
    // ==================

    async getDoctors(): Promise<ApiDoctor[]> {
        return this.request<ApiDoctor[]>("/doctors")
    }

    async getDoctorById(id: string): Promise<ApiDoctor> {
        return this.request<ApiDoctor>(`/doctors/${id}`)
    }

    async createDoctor(data: CreateDoctorDto): Promise<ApiDoctor> {
        return this.request<ApiDoctor>("/doctors", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateDoctor(id: string, data: UpdateDoctorDto): Promise<ApiDoctor> {
        return this.request<ApiDoctor>(`/doctors/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteDoctor(id: string): Promise<ApiDoctor> {
        return this.request<ApiDoctor>(`/doctors/${id}`, {
            method: "DELETE",
        })
    }

    // ==================
    // Users
    // ==================

    async getUsers(): Promise<ApiUser[]> {
        return this.request<ApiUser[]>("/users")
    }

    async getUserById(id: string): Promise<ApiUser> {
        return this.request<ApiUser>(`/users/${id}`)
    }

    async createUser(data: CreateUserDto): Promise<ApiUser> {
        return this.request<ApiUser>("/users", {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async updateUser(id: string, data: UpdateUserDto): Promise<ApiUser> {
        return this.request<ApiUser>(`/users/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        })
    }

    async deleteUser(id: string): Promise<ApiUser> {
        return this.request<ApiUser>(`/users/${id}`, {
            method: "DELETE",
        })
    }
}

export const browserApiClient = new BrowserApiClient()


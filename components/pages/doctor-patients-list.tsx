"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, User, Loader2, Users } from "lucide-react"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiUser } from "@/lib/types"

export function DoctorPatientsList() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await browserApiClient.getUsers()
        const patients = data.filter((u) => u.doctor === null && u.admin === null)
        setUsers(patients)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [])

  const filtered = users.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando pacientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 bg-background">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Pacientes</h1>
        <p className="text-muted-foreground">Pacientes registrados en la plataforma</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 bg-secondary border-border"
        />
      </div>

      {/* Patients list */}
      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-foreground">{patient.name || "Sin nombre"}</h3>
                  <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full shrink-0 ${
                    patient.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {patient.status === "Active" ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">
            {searchTerm ? "No se encontraron pacientes" : "No hay pacientes registrados"}
          </p>
        </div>
      )}
    </div>
  )
}

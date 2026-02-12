"use client"

import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Users, Stethoscope, Zap, Loader2 } from "lucide-react"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiDoctor, ApiUser, ApiSpecialty } from "@/lib/types"

const COLORS = ["#2a5ba7", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

export function AdminDashboard() {
  const [doctors, setDoctors] = useState<ApiDoctor[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [d, u, s] = await Promise.all([
          browserApiClient.getDoctors(),
          browserApiClient.getUsers(),
          browserApiClient.getSpecialties(),
        ])
        setDoctors(d)
        setUsers(u)
        setSpecialties(s)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalPatients = users.filter((u) => u.doctor === null && u.admin === null).length
  const totalDoctors = doctors.length
  const totalSpecialties = specialties.length
  const totalUsers = users.length

  const specialtiesData = specialties.map((s) => ({
    name: s.name,
    value: s._count?.doctors ?? 0,
  })).filter((s) => s.value > 0)

  const activeDoctors = doctors.filter((d) => d.status === "Activo")
  const avgRating = doctors.length > 0
    ? (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1)
    : "0"

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-2">Bienvenido al panel de control de RCH</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Usuarios</p>
          <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalPatients} pacientes</p>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Doctores</p>
          <p className="text-2xl font-bold text-foreground">{totalDoctors}</p>
          <p className="text-xs text-muted-foreground mt-1">{activeDoctors.length} activos</p>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Especialidades</p>
          <p className="text-2xl font-bold text-foreground">{totalSpecialties}</p>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Rating Promedio</p>
          <p className="text-2xl font-bold text-foreground">{avgRating}</p>
          <p className="text-xs text-muted-foreground mt-1">de {doctors.length} doctores</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Specialties */}
        <Card className="p-6 border border-border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">Distribución de Especialidades</h2>
            <p className="text-sm text-muted-foreground">Doctores por especialidad</p>
          </div>
          {specialtiesData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={specialtiesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {specialtiesData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {specialtiesData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No hay doctores asignados a especialidades</p>
            </div>
          )}
        </Card>

        {/* Doctors Table */}
        <Card className="p-6 border border-border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">Doctores Recientes</h2>
            <p className="text-sm text-muted-foreground">Últimos doctores registrados</p>
          </div>
          {doctors.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Doctor</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Especialidad</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.slice(0, 5).map((doctor) => (
                    <tr key={doctor.id} className="border-b border-border hover:bg-secondary transition">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{doctor.name}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{doctor.specialty.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            doctor.status === "Activo"
                              ? "bg-green-100 text-green-800"
                              : doctor.status === "Inactivo"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {doctor.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">No hay doctores registrados</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Users */}
      <Card className="p-6 border border-border">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">Usuarios Recientes</h2>
          <p className="text-sm text-muted-foreground">Últimos usuarios registrados en la plataforma</p>
        </div>
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Rol</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((user) => {
                  const role = user.admin ? "Admin" : user.doctor ? "Doctor" : "Paciente"
                  return (
                    <tr key={user.id} className="border-b border-border hover:bg-secondary transition">
                      <td className="px-4 py-3 text-sm text-foreground font-medium">{user.name || "Sin nombre"}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                          {role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status === "Active" ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No hay usuarios registrados</p>
          </div>
        )}
      </Card>
    </div>
  )
}

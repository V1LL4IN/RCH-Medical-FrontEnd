"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiDoctor, ApiUser, ApiSpecialty } from "@/lib/types"

const COLORS = ["#2a5ba7", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"]

export function ReportsPage() {
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

  const specialtyDistribution = specialties
    .map((s) => ({ name: s.name, value: s._count?.doctors ?? 0 }))
    .filter((s) => s.value > 0)

  const ratingDistribution = (() => {
    const buckets = [
      { rating: "5", count: 0 },
      { rating: "4", count: 0 },
      { rating: "3", count: 0 },
      { rating: "2", count: 0 },
      { rating: "1", count: 0 },
    ]
    for (const d of doctors) {
      const r = Math.round(d.rating)
      const bucket = buckets.find((b) => b.rating === String(r))
      if (bucket) bucket.count++
    }
    return buckets.filter((b) => b.count > 0)
  })()

  const totalPatients = users.filter((u) => u.doctor === null && u.admin === null).length
  const activeDoctors = doctors.filter((d) => d.status === "Activo").length
  const avgRating = doctors.length > 0
    ? (doctors.reduce((sum, d) => sum + d.rating, 0) / doctors.length).toFixed(1)
    : "0"

  const statusDistribution = (() => {
    const counts: Record<string, number> = {}
    for (const d of doctors) {
      counts[d.status] = (counts[d.status] || 0) + 1
    }
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  })()

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando reportes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
        <p className="text-muted-foreground mt-2">Análisis del estado actual de la plataforma</p>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Pacientes</p>
          <p className="text-3xl font-bold text-foreground">{totalPatients}</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Doctores Activos</p>
          <p className="text-3xl font-bold text-foreground">{activeDoctors}</p>
          <p className="text-xs text-muted-foreground mt-1">de {doctors.length} totales</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Rating Promedio</p>
          <p className="text-3xl font-bold text-foreground">{avgRating}</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Especialidades</p>
          <p className="text-3xl font-bold text-foreground">{specialties.length}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Specialty Distribution */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Distribución por Especialidad</h2>
          {specialtyDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={specialtyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {specialtyDistribution.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {specialtyDistribution.map((item, idx) => (
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
              <p className="text-muted-foreground">Sin datos disponibles</p>
            </div>
          )}
        </Card>

        {/* Doctor Status */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Estado de Doctores</h2>
          {statusDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" fill="#2a5ba7" name="Doctores" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-muted-foreground">Sin datos disponibles</p>
            </div>
          )}
        </Card>
      </div>

      {/* Rating Distribution */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Distribución de Ratings de Doctores</h2>
        {ratingDistribution.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="rating" stroke="#6b7280" label={{ value: "Estrellas", position: "insideBottom", offset: -5 }} />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#2a5ba7" name="Doctores" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px]">
            <p className="text-muted-foreground">Sin datos de ratings disponibles</p>
          </div>
        )}
      </Card>
    </div>
  )
}

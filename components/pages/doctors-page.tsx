"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiDoctor, DoctorStatus } from "@/lib/types"

const statusLabels: Record<DoctorStatus, string> = {
  Activo: "Activo",
  Inactivo: "Inactivo",
  DeVacaciones: "De Vacaciones",
}

export function DoctorsPage() {
  const searchParams = useSearchParams()
  const especialidadParam = searchParams.get("especialidad")

  const [doctors, setDoctors] = useState<ApiDoctor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(especialidadParam)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSpecialtyFilter(especialidadParam)
  }, [especialidadParam])

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await browserApiClient.getDoctors()
      setDoctors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar doctores")
    } finally {
      setLoading(false)
    }
  }

  const filtered = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSpecialty = !specialtyFilter || d.specialty.name.toLowerCase() === specialtyFilter.toLowerCase()

    // Only show active doctors on public page
    const isActive = d.status === "Activo"

    return matchesSearch && matchesSpecialty && isActive
  })

  if (loading) {
    return (
      <section className="w-full bg-background min-h-screen">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Nuestros Médicos</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Conoce a nuestros especialistas y elige el que mejor se adapte a tus necesidades
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando doctores...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full bg-background min-h-screen">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Nuestros Médicos</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg text-muted-foreground">{error}</p>
            <Button onClick={loadDoctors} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full bg-background">
      {/* Header section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Nuestros Médicos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Conoce a nuestros especialistas y elige el que mejor se adapte a tus necesidades
          </p>
        </div>
      </div>

      {/* Search section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar médico o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-secondary border-border"
            />
          </div>
          {specialtyFilter && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-2">
                {specialtyFilter}
                <button onClick={() => setSpecialtyFilter(null)} className="ml-2 hover:text-accent">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Doctors grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doctor) => (
            <div
              key={doctor.id}
              className="rounded-xl border border-border bg-card hover:border-primary hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              {/* Doctor avatar/initials */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {doctor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </span>
                </div>
              </div>

              {/* Doctor info */}
              <div className="flex-1 p-6 flex flex-col">
                <h3 className="text-xl font-bold text-foreground mb-1">{doctor.name}</h3>
                <p className="text-sm font-semibold text-primary mb-3">{doctor.specialty.name}</p>

                {/* Experience & Rating */}
                <div className="flex items-center gap-4 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {doctor.experienceYears} años exp.
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-foreground">{doctor.rating}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex-1"></div>
                <div className="pt-4 border-t border-border">
                  <Link href={`/agendar/${doctor.id}`} className="w-full">
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                      Agendar Cita
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No se encontraron médicos</p>
            {specialtyFilter && (
              <Button variant="outline" onClick={() => setSpecialtyFilter(null)}>
                Ver todos los médicos
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

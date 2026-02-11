"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiSpecialty } from "@/lib/types"

export function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSpecialties()
  }, [])

  const loadSpecialties = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await browserApiClient.getSpecialties()
      setSpecialties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar especialidades")
    } finally {
      setLoading(false)
    }
  }

  const filtered = specialties.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <section className="w-full bg-background min-h-screen">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Especialidades Médicas</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Encuentra el especialista que necesitas entre nuestras diversas especialidades médicas
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando especialidades...</p>
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
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Especialidades Médicas</h1>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="text-lg text-muted-foreground">{error}</p>
            <Button onClick={loadSpecialties} variant="outline">
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
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Especialidades Médicas</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Encuentra el especialista que necesitas entre nuestras diversas especialidades médicas
          </p>
        </div>
      </div>

      {/* Search section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 bg-secondary border-border"
          />
        </div>
      </div>

      {/* Specialties grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((specialty) => (
            <Link key={specialty.id} href={`/medicos?especialidad=${encodeURIComponent(specialty.name)}`}>
              <div className="group overflow-hidden rounded-xl border border-border bg-card hover:border-primary hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 cursor-pointer h-full flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-secondary">
                  <img
                    src={specialty.imageUrl || "/placeholder.svg"}
                    alt={specialty.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="text-xl font-bold text-foreground mb-2">{specialty.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-2">{specialty.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm font-semibold text-primary">
                      {specialty._count?.doctors || 0} especialista{(specialty._count?.doctors || 0) !== 1 ? "s" : ""}
                    </span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Ver Médicos
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No se encontraron especialidades</p>
          </div>
        )}
      </div>
    </section>
  )
}

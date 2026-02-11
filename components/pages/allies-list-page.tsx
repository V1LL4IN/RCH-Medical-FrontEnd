"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Phone, Percent, X, FlaskConical, ImageIcon, Pill, Stethoscope } from "lucide-react"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import type { ServiceType, Sector } from "@/lib/types"

export function AlliesListPage() {
  const searchParams = useSearchParams()
  const tipoParam = searchParams.get("tipo") as ServiceType | null
  const sectorParam = searchParams.get("sector") as Sector | null

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<ServiceType | null>(tipoParam)
  const [sectorFilter, setSectorFilter] = useState<Sector | null>(sectorParam)

  const { allies, currentUser } = useStore()

  useEffect(() => {
    setTypeFilter(tipoParam)
    setSectorFilter(sectorParam)
  }, [tipoParam, sectorParam])

  const filtered = allies.filter((ally) => {
    const matchesSearch = ally.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = !typeFilter || ally.type === typeFilter
    const matchesSector = !sectorFilter || ally.sector === sectorFilter
    return matchesSearch && matchesType && matchesSector
  })

  const getTypeIcon = (type: ServiceType) => {
    switch (type) {
      case "laboratory":
        return <FlaskConical className="w-5 h-5" />
      case "imaging":
        return <ImageIcon className="w-5 h-5" />
      case "pharmacy":
        return <Pill className="w-5 h-5" />
      case "dental":
        return <Stethoscope className="w-5 h-5" />
      default:
        return <Stethoscope className="w-5 h-5" />
    }
  }

  const getTypeLabel = (type: ServiceType) => {
    switch (type) {
      case "laboratory":
        return "Laboratorio"
      case "imaging":
        return "Rayos X / Imagen"
      case "pharmacy":
        return "Farmacia"
      case "dental":
        return "Odontología"
      case "medical":
        return "Médico"
      default:
        return type
    }
  }

  const getSectorLabel = (sector: Sector) => {
    switch (sector) {
      case "norte":
        return "Norte"
      case "centro":
        return "Centro"
      case "sur":
        return "Sur"
      default:
        return sector
    }
  }

  const typeOptions: ServiceType[] = ["laboratory", "imaging", "pharmacy", "dental"]
  const sectorOptions: Sector[] = ["norte", "centro", "sur"]

  return (
    <section className="w-full bg-background flex-1">
      {/* Header section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Aliados RCH</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Farmacias, laboratorios y centros de imagen con descuentos exclusivos para miembros
          </p>
        </div>
      </div>

      {/* Filters section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar aliado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Type filters */}
          {typeOptions.map((type) => (
            <Button
              key={type}
              variant={typeFilter === type ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(typeFilter === type ? null : type)}
              className={typeFilter === type ? "bg-primary" : "bg-transparent"}
            >
              {getTypeIcon(type)}
              <span className="ml-2">{getTypeLabel(type)}</span>
            </Button>
          ))}
          <div className="w-px h-8 bg-border mx-2" />
          {/* Sector filters */}
          {sectorOptions.map((sector) => (
            <Button
              key={sector}
              variant={sectorFilter === sector ? "default" : "outline"}
              size="sm"
              onClick={() => setSectorFilter(sectorFilter === sector ? null : sector)}
              className={sectorFilter === sector ? "bg-accent" : "bg-transparent"}
            >
              <MapPin className="w-4 h-4" />
              <span className="ml-1">{getSectorLabel(sector)}</span>
            </Button>
          ))}
        </div>

        {/* Active filters */}
        {(typeFilter || sectorFilter) && (
          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {typeFilter && (
              <Badge variant="secondary" className="gap-1">
                {getTypeLabel(typeFilter)}
                <button onClick={() => setTypeFilter(null)} className="ml-1 hover:text-accent">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {sectorFilter && (
              <Badge variant="secondary" className="gap-1">
                {getSectorLabel(sectorFilter)}
                <button onClick={() => setSectorFilter(null)} className="ml-1 hover:text-accent">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setTypeFilter(null)
                setSectorFilter(null)
              }}
              className="text-xs text-muted-foreground"
            >
              Limpiar todos
            </Button>
          </div>
        )}
      </div>

      {/* Allies grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ally) => (
            <div
              key={ally.id}
              className="rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-secondary">
                <img
                  src={ally.photo || "/placeholder.svg"}
                  alt={ally.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-background/90 text-foreground border-0 gap-1">
                    {getTypeIcon(ally.type)}
                    {getTypeLabel(ally.type)}
                  </Badge>
                </div>
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-foreground mb-2">{ally.name}</h3>

                {/* Sector - NOT full address */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Sector {getSectorLabel(ally.sector)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>{ally.phone}</span>
                </div>

                {/* Discount */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Percent className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-lg font-bold text-accent">{ally.discount}% descuento</p>
                      <p className="text-xs text-muted-foreground">para miembros RCH</p>
                    </div>
                  </div>
                  {!currentUser?.membershipActive && (
                    <Badge variant="outline" className="text-xs">
                      Hazte miembro
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No se encontraron aliados</p>
            <Button
              variant="outline"
              onClick={() => {
                setTypeFilter(null)
                setSectorFilter(null)
                setSearchTerm("")
              }}
            >
              Ver todos los aliados
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}

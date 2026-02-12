"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight, Stethoscope } from "lucide-react"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiSpecialty } from "@/lib/types"

export function Specialties() {
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    browserApiClient
      .getSpecialties()
      .then((data) => setSpecialties(data))
      .catch(() => setSpecialties([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="w-full py-20 md:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Especialidades Médicas</h2>
            <p className="text-lg text-muted-foreground">Encuentra el especialista que necesitas en nuestra red</p>
          </div>
          <Link
            href="/especialidades"
            className="flex items-center gap-2 text-primary font-semibold whitespace-nowrap hover:gap-4 transition-all"
          >
            Ver todas
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted mb-4" />
                <div className="h-5 w-2/3 bg-muted rounded mb-2" />
                <div className="h-4 w-1/3 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : specialties.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No hay especialidades disponibles por el momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {specialties.slice(0, 8).map((specialty) => (
              <Link key={specialty.id} href={`/medicos?especialidad=${encodeURIComponent(specialty.name)}`}>
                <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
                  {specialty.imageUrl ? (
                    <img
                      src={specialty.imageUrl}
                      alt={specialty.name}
                      className="w-10 h-10 rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg text-foreground mb-1">{specialty.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {specialty._count?.doctors ?? 0} especialistas
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-background to-secondary">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                Tu salud en un solo lugar
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg text-balance">
                Accede a especialistas, reserva citas y gestiona tu historial médico desde cualquier lugar, en cualquier
                momento.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/especialidades">
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Reservar Cita
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/especialidades">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Ver Especialidades
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Médicos Especialistas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">24/7</p>
                <p className="text-sm text-muted-foreground">Disponibilidad</p>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white rounded-3xl border border-border shadow-xl p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Próxima Cita</h3>
                  <span className="text-xs bg-accent/20 text-accent-foreground px-3 py-1 rounded-full">HOY</span>
                </div>
                <div className="bg-primary/10 rounded-2xl p-4 space-y-2">
                  <p className="font-semibold text-foreground">Dr. Carlos García</p>
                  <p className="text-sm text-muted-foreground">Cardiología</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Hora</p>
                    <p className="font-semibold text-foreground">2:30 PM</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Consultorio</p>
                    <p className="font-semibold text-foreground">301</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

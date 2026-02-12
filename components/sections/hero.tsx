"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Search, CalendarCheck, HeartPulse, ShieldCheck } from "lucide-react"

const steps = [
  {
    icon: Search,
    label: "Busca tu especialista",
    description: "Explora nuestra red de médicos por especialidad",
  },
  {
    icon: CalendarCheck,
    label: "Agenda tu cita",
    description: "Elige el horario que mejor se adapte a ti",
  },
  {
    icon: HeartPulse,
    label: "Recibe atención",
    description: "Consulta presencial o virtual con tu médico",
  },
]

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
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-card rounded-3xl border border-border shadow-xl p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Comienza en 3 pasos</h3>
                    <p className="text-xs text-muted-foreground">Rápido, seguro y fácil</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {steps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      {/* Step indicator */}
                      <div className="flex flex-col items-center">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <step.icon className="w-5 h-5 text-primary" />
                        </div>
                        {i < steps.length - 1 && (
                          <div className="w-px h-6 bg-border mt-1" />
                        )}
                      </div>
                      {/* Step content */}
                      <div className="pt-1">
                        <p className="font-semibold text-foreground text-sm">{step.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link href="/registro" className="block">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    Crear cuenta gratis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

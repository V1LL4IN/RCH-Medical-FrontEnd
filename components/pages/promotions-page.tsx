"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gift, Zap, Star } from "lucide-react"

const promotions = [
  {
    id: 1,
    title: "Primera Consulta -30%",
    description: "Descuento especial para nuevos usuarios en su primera cita",
    discount: "30%",
    icon: Gift,
    color: "from-primary/20 to-primary/10",
    conditions: ["Válido para nuevos usuarios", "Aplicable a cualquier especialista", "Válido hasta fin de mes"],
  },
  {
    id: 2,
    title: "Pack 5 Consultas",
    description: "Obtén 5 consultas con el mismo médico al mejor precio",
    discount: "-25%",
    icon: Zap,
    color: "from-accent/20 to-accent/10",
    conditions: ["5 citas agendadas", "Mismo especialista", "Válidas por 3 meses"],
  },
  {
    id: 3,
    title: "Referidos Premium",
    description: "Refiere amigos y obtén créditos para tus consultas",
    discount: "Rewards",
    icon: Star,
    color: "from-purple-200/30 to-pink-200/30",
    conditions: ["$10 por cada referido", "Amigo recibe -15%", "Acumula sin límite"],
  },
]

export function PromotionsPage() {
  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Promociones y Ofertas Especiales
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Aprovecha nuestras promociones exclusivas y obtén el mejor precio en tus consultas médicas
          </p>
        </div>

        {/* Promotions grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {promotions.map((promo) => {
            const Icon = promo.icon
            return (
              <div
                key={promo.id}
                className={`relative overflow-hidden rounded-xl p-8 border border-border bg-gradient-to-br ${promo.color} hover:border-primary transition-all duration-300`}
              >
                <div className="absolute top-4 right-4 opacity-10">
                  <Icon className="w-16 h-16" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">{promo.discount}</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">{promo.title}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{promo.description}</p>

                  <div className="space-y-2 mb-6 pb-6 border-b border-border">
                    {promo.conditions.map((condition) => (
                      <div key={condition} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        {condition}
                      </div>
                    ))}
                  </div>

                  <Link href="/especialidades">
                    <Button className="w-full bg-primary hover:bg-primary/90">Aprovechar</Button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Featured promotion */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-12 md:p-16 text-primary-foreground">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planes de Afiliación Anual</h2>
            <p className="text-lg text-primary-foreground/80 mb-6">
              Acceso ilimitado a consultas con descuentos especiales, exámenes gratis y atención prioritaria
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="font-bold mb-1">Consulta Ilimitada</p>
                <p className="text-xs text-primary-foreground/80">Sin límite de visitas</p>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="font-bold mb-1">Exámenes Gratis</p>
                <p className="text-xs text-primary-foreground/80">2 exámenes por mes</p>
              </div>
              <div className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="font-bold mb-1">Atención 24/7</p>
                <p className="text-xs text-primary-foreground/80">Telemedicina disponible</p>
              </div>
            </div>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Ver Planes de Membresía
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

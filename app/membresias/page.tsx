import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const memberships = [
  {
    name: "Plan Básico",
    price: "$29",
    period: "/mes",
    description: "Ideal para cuidado básico de salud",
    badge: null,
    features: [
      "2 consultas médicas al mes",
      "Telemedicina ilimitada",
      "10% descuento en exámenes",
      "Historial médico digital",
      "Recordatorios de citas",
    ],
    cta: "Comenzar Ahora",
  },
  {
    name: "Plan Familiar",
    price: "$79",
    period: "/mes",
    description: "Perfecto para toda la familia",
    badge: "Más Popular",
    features: [
      "5 consultas médicas al mes",
      "Telemedicina ilimitada",
      "25% descuento en exámenes",
      "Médico en casa (1 vez/mes)",
      "Hasta 4 miembros de familia",
      "Historial médico familiar",
      "Prioridad en agendamiento",
    ],
    cta: "Elegir Plan",
    highlighted: true,
  },
  {
    name: "Plan Premium",
    price: "$149",
    period: "/mes",
    description: "Atención médica completa y personalizada",
    badge: "Recomendado",
    features: [
      "Consultas médicas ilimitadas",
      "Telemedicina 24/7",
      "40% descuento en exámenes",
      "Médico en casa (3 veces/mes)",
      "Especialistas sin costo adicional",
      "Seguimiento personalizado",
      "Atención prioritaria",
      "Concierge médico",
    ],
    cta: "Obtener Premium",
  },
]

export default function MembresiasPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">Planes de Membresía</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
                Elige el plan perfecto para ti y tu familia. Atención médica de calidad a tu alcance
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {memberships.map((membership) => (
                <div
                  key={membership.name}
                  className={`relative rounded-2xl border ${
                    membership.highlighted ? "border-accent shadow-2xl scale-105 bg-card" : "border-border bg-card"
                  } p-8 flex flex-col`}
                >
                  {membership.badge && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent hover:bg-accent text-accent-foreground">
                      {membership.badge}
                    </Badge>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{membership.name}</h3>
                    <p className="text-sm text-muted-foreground">{membership.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-foreground">{membership.price}</span>
                      <span className="text-muted-foreground">{membership.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8 flex-1">
                    {membership.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button size="lg" className={membership.highlighted ? "bg-accent hover:bg-accent/90" : ""} asChild>
                    <Link href="/registro">{membership.cta}</Link>
                  </Button>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">¿Tienes preguntas? Nuestro equipo está aquí para ayudarte</p>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contacto">Contáctanos</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

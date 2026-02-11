import { Stethoscope, Home, Video, Pill, FileText, Heart } from "lucide-react"
import Link from "next/link"

const services = [
  {
    icon: Stethoscope,
    title: "Consultorios",
    description: "Citas presenciales con médicos especialistas en nuestras sedes",
    href: "#",
  },
  {
    icon: Video,
    title: "Telemedicina",
    description: "Consultas online desde la comodidad de tu hogar",
    href: "#",
  },
  {
    icon: Home,
    title: "Médico en Casa",
    description: "Atención médica en la puerta de tu hogar",
    href: "#",
  },
  {
    icon: Pill,
    title: "Exámenes",
    description: "Acceso a laboratorio clínico y exámenes especializados",
    href: "#",
  },
  {
    icon: FileText,
    title: "Historial Médico",
    description: "Gestiona tus resultados y documentos médicos",
    href: "#",
  },
  {
    icon: Heart,
    title: "Seguimiento",
    description: "Monitoreo continuo de tu salud y bienestar",
    href: "#",
  },
]

export function Services() {
  return (
    <section className="w-full py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Nuestros Servicios</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Una completa gama de servicios médicos diseñados para tu bienestar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Link key={service.title} href={service.href}>
                <div className="group h-full p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Stethoscope, FlaskConical, ImageIcon, Pill, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const serviceCategories = [
  {
    icon: Stethoscope,
    title: "Médicos Especialistas",
    description: "Consultas presenciales, telemedicina y atención a domicilio con nuestros médicos certificados.",
    href: "/medicos",
    discount: "Desde $12 con membresía",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FlaskConical,
    title: "Laboratorio Clínico",
    description: "Exámenes de sangre, orina, heces y más. Resultados rápidos y confiables en nuestros aliados.",
    href: "/aliados?tipo=laboratory",
    discount: "Hasta 20% de descuento",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: ImageIcon,
    title: "Rayos X e Imagen",
    description: "Radiografías, ecografías, tomografías y resonancias en centros especializados.",
    href: "/aliados?tipo=imaging",
    discount: "Hasta 25% de descuento",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Pill,
    title: "Farmacia",
    description: "Medicamentos con receta y de venta libre en farmacias aliadas a nivel nacional.",
    href: "/aliados?tipo=pharmacy",
    discount: "Hasta 15% de descuento",
    color: "bg-green-500/10 text-green-600",
  },
  {
    icon: Stethoscope,
    title: "Odontología",
    description: "Servicios dentales completos: limpieza, ortodoncia, implantes y más.",
    href: "/medicos?especialidad=Odontología",
    discount: "Hasta 20% de descuento",
    color: "bg-cyan-500/10 text-cyan-600",
  },
]

export default function ServiciosPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">Nuestros Servicios</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
                Accede a una red completa de servicios de salud con descuentos exclusivos para miembros
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceCategories.map((service) => {
                const Icon = service.icon
                return (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="group h-full p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all duration-300"
                  >
                    <div className={`flex items-center justify-center w-14 h-14 rounded-lg ${service.color} mb-5`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                      <span className="text-sm font-semibold text-accent">{service.discount}</span>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              ¿Listo para cuidar tu salud?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Hazte miembro y accede a todos los descuentos en servicios médicos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90" asChild>
                <Link href="/membresias">Ver Membresías</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent" asChild>
                <Link href="/aliados">Ver Todos los Aliados</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}

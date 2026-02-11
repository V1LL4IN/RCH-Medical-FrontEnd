import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export function Promotion() {
  return (
    <section className="w-full py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 md:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-background" />
              <span className="font-semibold text-white">PROMOCIÓN ESPECIAL</span>
            </div>

            <h3 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4 text-balance">
              Primera consulta con descuento especial
            </h3>

            <p className="text-lg text-primary-foreground/80 mb-8">
              Obtén 30% de descuento en tu primera cita con cualquier especialista. Válido para nuevos usuarios durante
              este mes.
            </p>

            <Link href="/especialidades">
              <Button size="lg" className="hover:bg-accent/90 text-accent-foreground bg-secondary-foreground">
                Aprovechar Descuento
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

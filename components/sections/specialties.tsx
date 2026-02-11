import Link from "next/link"
import { ChevronRight } from "lucide-react"

const specialties = [
  {
    id: 1,
    name: "Medicina General",
    doctors: 45,
    icon: "🏥",
  },
  {
    id: 2,
    name: "Ginecología",
    doctors: 28,
    icon: "👩‍⚕️",
  },
  {
    id: 3,
    name: "Endocrinología",
    doctors: 15,
    icon: "💊",
  },
  {
    id: 4,
    name: "Psicología",
    doctors: 32,
    icon: "🧠",
  },
  {
    id: 5,
    name: "Cardiología",
    doctors: 22,
    icon: "❤️",
  },
  {
    id: 6,
    name: "Odontología",
    doctors: 38,
    icon: "🦷",
  },
  {
    id: 7,
    name: "Traumatología",
    doctors: 19,
    icon: "🦴",
  },
  {
    id: 8,
    name: "Medicina Física",
    doctors: 12,
    icon: "🏃",
  },
]

export function Specialties() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {specialties.map((specialty) => (
            <Link key={specialty.id} href={`/especialidades/${specialty.id}`}>
              <div className="group p-6 rounded-xl bg-card border border-border hover:border-primary hover:shadow-lg hover:translate-y-[-4px] transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-4">{specialty.icon}</div>
                <h3 className="font-semibold text-lg text-foreground mb-1">{specialty.name}</h3>
                <p className="text-sm text-muted-foreground">{specialty.doctors} especialistas</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

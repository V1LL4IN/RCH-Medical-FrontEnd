"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ChevronLeft, ChevronRight, Clock, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import Link from "next/link"

export function AppointmentsCalendar() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { appointments } = useStore()
  const [currentDate, setCurrentDate] = useState(new Date())

  const currentUser = session?.user

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login")
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const userAppointments = appointments
    .filter((apt) => apt.patientId === currentUser.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const hasAppointmentOnDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return userAppointments.some((a) => a.date === dateStr)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pagada</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case "norte":
        return "Sector Norte"
      case "centro":
        return "Sector Centro"
      case "sur":
        return "Sector Sur"
      default:
        return sector
    }
  }

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case "presencial":
        return "Presencial"
      case "telemedicina":
        return "Telemedicina"
      case "domicilio":
        return "A Domicilio"
      default:
        return modality
    }
  }

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-balance">Mis Citas Médicas</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-foreground capitalize">
                  {currentDate.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex gap-2">
                  <button onClick={handlePrevMonth} className="p-2 hover:bg-secondary rounded-lg transition">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={handleNextMonth} className="p-2 hover:bg-secondary rounded-lg transition">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days of week */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`}></div>
                ))}
                {days.map((day) => (
                  <button
                    key={day}
                    className={`aspect-square rounded-lg font-semibold text-sm transition-all ${hasAppointmentOnDate(day)
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-muted"
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick action */}
            <Link href="/medicos" className="block mt-4">
              <Button className="w-full bg-primary hover:bg-primary/90">Agendar Nueva Cita</Button>
            </Link>
          </div>

          {/* Appointments list */}
          <div className="lg:col-span-2 space-y-4">
            {userAppointments.length > 0 ? (
              userAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{appointment.doctorName}</h3>
                      <p className="text-sm text-primary font-semibold">{appointment.specialty}</p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(appointment.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      a las {appointment.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {getSectorLabel(appointment.sector)} - {getModalityLabel(appointment.modality)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">${appointment.price}</span>
                      {appointment.isMember && (
                        <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                          Precio miembro
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {appointment.status === "pending" && (
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Cancelar
                        </Button>
                      )}
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">No tienes citas programadas</h3>
                <p className="text-muted-foreground mb-6">Agenda tu primera cita con nuestros especialistas</p>
                <Link href="/medicos">
                  <Button className="bg-primary hover:bg-primary/90">Buscar Médicos</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

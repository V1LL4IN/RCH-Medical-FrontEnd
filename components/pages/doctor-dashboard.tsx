"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Users, CheckCircle, Clock, Settings, LogOut, MoreVertical, Stethoscope } from "lucide-react"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function DoctorDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { appointments, doctors } = useStore()
  const [filter, setFilter] = useState<"paid" | "pending" | "all">("paid")

  const currentUser = session?.user

  // Find doctor data from current user's doctorId
  const doctor = currentUser?.doctorId ? doctors.find(d => d.id === currentUser.doctorId) : null

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login")
    } else if (status === 'authenticated' && currentUser?.role !== "doctor") {
      router.push("/dashboard")
    }
  }, [status, currentUser, router])

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

  if (!currentUser || currentUser.role !== "doctor") {
    return null
  }

  // Get appointments for this doctor
  const doctorAppointments = appointments.filter(a => a.doctorId === currentUser.doctorId)

  // Filter appointments based on selected filter
  const filteredAppointments = doctorAppointments.filter(a => {
    if (filter === "paid") return a.status === "paid"
    if (filter === "pending") return a.status === "pending" || a.status === "pending_verification"
    return true
  })

  // Sort by date and time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Stats calculations
  const paidCount = doctorAppointments.filter(a => a.status === "paid").length
  const completedCount = doctorAppointments.filter(a => a.status === "completed").length
  const todayAppointments = doctorAppointments.filter(a => {
    const today = new Date().toISOString().split("T")[0]
    return a.date === today && (a.status === "paid" || a.status === "completed")
  }).length

  const stats = [
    { icon: Users, label: "Pacientes Atendidos", value: completedCount.toString(), color: "primary" },
    { icon: Calendar, label: "Citas Hoy", value: todayAppointments.toString(), color: "primary" },
    { icon: CheckCircle, label: "Por Atender", value: paidCount.toString(), color: "primary" },
    { icon: Clock, label: "Tiempo Promedio", value: "25 min", color: "primary" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Pagada</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>
      case "pending_verification":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Por Verificar</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completada</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  // Declare doctorData and scheduledAppointments
  const doctorData = doctor || { avatar: "", name: "", specialty: "", yearsExperience: 0, rating: 0 }
  const scheduledAppointments = doctorAppointments.filter(a => {
    const today = new Date().toISOString().split("T")[0]
    return a.date === today
  })

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with doctor profile */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={doctor?.photo || "/doctor-hombre-profesional.jpg"}
            alt={currentUser.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-primary"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">{currentUser.name}</h1>
            <p className="text-primary font-semibold mb-1">{doctor?.specialty || "Especialista"}</p>
            <p className="text-muted-foreground mb-4">
              Red Cedco Health - Portal Médico
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Editar Perfil
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent border-border">
                Configuración
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="bg-transparent border-border">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent border-border" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Appointments */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Citas</h2>
                <p className="text-sm text-muted-foreground mt-1">{sortedAppointments.length} citas encontradas</p>
              </div>
              {/* Filter tabs */}
              <div className="flex gap-2">
                <Button
                  variant={filter === "paid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("paid")}
                  className={filter === "paid" ? "bg-primary" : "bg-transparent"}
                >
                  Pagadas ({doctorAppointments.filter(a => a.status === "paid").length})
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                  className={filter === "pending" ? "bg-primary" : "bg-transparent"}
                >
                  Pendientes ({doctorAppointments.filter(a => a.status === "pending" || a.status === "pending_verification").length})
                </Button>
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={filter === "all" ? "bg-primary" : "bg-transparent"}
                >
                  Todas
                </Button>
              </div>
            </div>
          </div>

          {sortedAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay citas {filter === "paid" ? "pagadas" : filter === "pending" ? "pendientes" : ""} por mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Paciente</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Hora</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Motivo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAppointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b border-border hover:bg-secondary transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-foreground">{appointment.patientName}</p>
                          <p className="text-xs text-muted-foreground">C.I.: {appointment.patientCedula}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {new Date(appointment.date).toLocaleDateString("es-ES", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{appointment.time}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">
                        {appointment.reason || "No especificado"}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(appointment.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {appointment.status === "paid" && (
                            <Link href={`/doctor/consulta/${appointment.id}`}>
                              <Button size="sm" className="bg-accent hover:bg-accent/90 gap-1">
                                <Stethoscope className="w-4 h-4" />
                                Atender
                              </Button>
                            </Link>
                          )}
                          <Button variant="outline" size="icon" className="bg-transparent border-border">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="h-12 bg-primary hover:bg-primary/90 text-base">Agregar Nota Médica</Button>
          <Button variant="outline" className="h-12 bg-transparent border-border text-base">
            Ver Disponibilidad
          </Button>
          <Button variant="outline" className="h-12 bg-transparent border-border text-base">
            Reportes y Estadísticas
          </Button>
        </div>
      </div>
    </section>
  )
}

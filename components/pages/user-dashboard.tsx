"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, FileText, Settings, LogOut, Edit2, CreditCard } from "lucide-react"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

export function UserDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { appointments } = useStore()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push("/login")
    }
  }, [status, router])

  // Show loading while checking authentication
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

  // Return null if not authenticated
  if (!session?.user) {
    return null
  }

  const currentUser = session.user

  const userAppointments = appointments
    .filter((apt) => apt.patientId === currentUser.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const upcomingAppointments = userAppointments.filter(
    (apt) => new Date(apt.date) >= new Date() && apt.status !== "cancelled",
  )

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
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

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with profile */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {(currentUser.name || 'Usuario')
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-foreground mb-2">{currentUser.name}</h1>
            <p className="text-muted-foreground mb-2">{currentUser.email}</p>
            {currentUser.membershipActive ? (
              <Badge className="bg-accent/10 text-accent border-accent/20">
                <CreditCard className="w-3 h-3 mr-1" />
                Miembro Activo
              </Badge>
            ) : (
              <Link href="/membresias">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/10">
                  Obtener membresía
                </Badge>
              </Link>
            )}
            <div className="mt-4">
              <Link href="/dashboard/perfil">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              </Link>
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

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximas Citas</p>
                <p className="font-bold text-foreground">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-bold text-foreground">
                  {currentUser.membershipActive ? "Miembro" : "Sin membresía"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Citas</p>
                <p className="font-bold text-foreground">{userAppointments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming appointments */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Próximas Citas</h2>
                <Link href="/citas">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Ver todas
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border border-border rounded-lg hover:border-primary transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{appointment.doctorName}</h3>
                          <p className="text-sm text-primary">{appointment.specialty}</p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {new Date(appointment.date).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        a las {appointment.time}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {appointment.modality === "presencial" && "Presencial"}
                          {appointment.modality === "telemedicina" && "Telemedicina"}
                          {appointment.modality === "domicilio" && "A Domicilio"}
                          {" - "}
                          {appointment.sector === "norte" && "Sector Norte"}
                          {appointment.sector === "centro" && "Sector Centro"}
                          {appointment.sector === "sur" && "Sector Sur"}
                        </span>
                        <span className="font-bold text-primary">${appointment.price}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No tienes citas programadas</p>
                  </div>
                )}
              </div>

              <Link href="/medicos">
                <Button className="w-full mt-6 bg-primary hover:bg-primary/90">Agendar Nueva Cita</Button>
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Acciones Rápidas</h2>

            <div className="space-y-3">
              <Link href="/medicos" className="block">
                <div className="p-4 bg-secondary rounded-lg cursor-pointer hover:bg-muted transition flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Agendar Cita</span>
                </div>
              </Link>

              <Link href="/citas" className="block">
                <div className="p-4 bg-secondary rounded-lg cursor-pointer hover:bg-muted transition flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Ver Mis Citas</span>
                </div>
              </Link>

              <Link href="/resultados" className="block">
                <div className="p-4 bg-secondary rounded-lg cursor-pointer hover:bg-muted transition flex items-center gap-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Mis Resultados</span>
                </div>
              </Link>

              {!currentUser.membershipActive && (
                <Link href="/membresias" className="block">
                  <div className="p-4 bg-accent/10 rounded-lg cursor-pointer hover:bg-accent/20 transition flex items-center gap-3 border border-accent/20">
                    <CreditCard className="w-5 h-5 text-accent" />
                    <span className="font-medium text-accent">Obtener Membresía</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

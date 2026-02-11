"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Download } from "lucide-react"

const appointmentsData = [
  {
    id: 1,
    patient: "Juan Pérez García",
    doctor: "Dr. Carlos García",
    specialty: "Cardiología",
    date: "2025-01-15",
    time: "2:30 PM",
    status: "completed",
    paymentStatus: "paid",
    price: "$150",
  },
  {
    id: 2,
    patient: "María López Rodríguez",
    doctor: "Dra. María Rodríguez",
    specialty: "Ginecología",
    date: "2025-01-16",
    time: "10:00 AM",
    status: "scheduled",
    paymentStatus: "paid",
    price: "$120",
  },
  {
    id: 3,
    patient: "Pedro Sánchez Martinez",
    doctor: "Dr. Roberto López",
    specialty: "Endocrinología",
    date: "2025-01-17",
    time: "3:00 PM",
    status: "scheduled",
    paymentStatus: "pending",
    price: "$140",
  },
  {
    id: 4,
    patient: "Laura Fernández Díaz",
    doctor: "Dr. Carlos García",
    specialty: "Cardiología",
    date: "2025-01-18",
    time: "11:30 AM",
    status: "cancelled",
    paymentStatus: "refunded",
    price: "$150",
  },
]

export function AppointmentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredAppointments = appointmentsData.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      scheduled: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getPaymentColor = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      refunded: "bg-gray-100 text-gray-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
          <p className="text-muted-foreground mt-2">Administra todas las citas de la plataforma</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Descargar Reporte
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Citas</p>
          <p className="text-2xl font-bold text-foreground">{appointmentsData.length}</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Completadas</p>
          <p className="text-2xl font-bold text-green-600">
            {appointmentsData.filter((a) => a.status === "completed").length}
          </p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Programadas</p>
          <p className="text-2xl font-bold text-blue-600">
            {appointmentsData.filter((a) => a.status === "scheduled").length}
          </p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Ingresos</p>
          <p className="text-2xl font-bold text-foreground">$5,270</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 border border-border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar paciente o doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="scheduled">Programadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </Card>

      {/* Appointments Table */}
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Paciente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Especialidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha y Hora</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Precio</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado Cita</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Pago</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-border hover:bg-secondary transition">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{apt.patient}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{apt.doctor}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{apt.specialty}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {apt.date} - {apt.time}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{apt.price}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        apt.status,
                      )}`}
                    >
                      {apt.status === "completed"
                        ? "Completada"
                        : apt.status === "scheduled"
                          ? "Programada"
                          : "Cancelada"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(
                        apt.paymentStatus,
                      )}`}
                    >
                      {apt.paymentStatus === "paid"
                        ? "Pagado"
                        : apt.paymentStatus === "pending"
                          ? "Pendiente"
                          : "Reembolsado"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        Ver Detalles
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAppointments.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron citas</p>
          </div>
        )}
      </Card>
    </div>
  )
}

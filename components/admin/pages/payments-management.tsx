"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, Download, TrendingUp } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const paymentsData = [
  {
    id: 1,
    patient: "Juan Pérez",
    doctor: "Dr. Carlos García",
    amount: "$150",
    date: "2025-01-15",
    method: "Tarjeta",
    status: "completed",
  },
  {
    id: 2,
    patient: "María López",
    doctor: "Dra. María Rodríguez",
    amount: "$120",
    date: "2025-01-16",
    method: "Transferencia",
    status: "completed",
  },
  {
    id: 3,
    patient: "Pedro Sánchez",
    doctor: "Dr. Roberto López",
    amount: "$140",
    date: "2025-01-17",
    method: "Tarjeta",
    status: "pending",
  },
]

const revenueData = [
  { mes: "Ene", ingresos: 12000, objetivo: 15000 },
  { mes: "Feb", ingresos: 14500, objetivo: 15000 },
  { mes: "Mar", ingresos: 16200, objetivo: 15000 },
  { mes: "Abr", ingresos: 13800, objetivo: 15000 },
  { mes: "May", ingresos: 15600, objetivo: 15000 },
  { mes: "Jun", ingresos: 18900, objetivo: 15000 },
]

export function PaymentsManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPayments = paymentsData.filter(
    (payment) =>
      payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalRevenue = paymentsData.reduce((sum, payment) => sum + Number.parseInt(payment.amount.replace("$", "")), 0)
  const completedCount = paymentsData.filter((p) => p.status === "completed").length
  const pendingCount = paymentsData.filter((p) => p.status === "pending").length

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Pagos</h1>
          <p className="text-muted-foreground mt-2">Control de ingresos y transacciones</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Descargar Reporte
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
              <p className="text-2xl font-bold text-foreground">${totalRevenue}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pagos Completados</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pagos Pendientes</p>
          <p className="text-2xl font-bold text-yellow-600">${pendingCount * 140}</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Ticket Promedio</p>
          <p className="text-2xl font-bold text-foreground">${(totalRevenue / paymentsData.length).toFixed(0)}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Ingresos Mensuales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ingresos" stroke="#2a5ba7" strokeWidth={2} />
              <Line type="monotone" dataKey="objetivo" stroke="#d1d5db" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Métodos de Pago</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { method: "Tarjeta", count: 15 },
                { method: "Transferencia", count: 8 },
                { method: "Otro", count: 4 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="method" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#2a5ba7" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 border border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por paciente o doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Paciente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Doctor</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Monto</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Método</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-border hover:bg-secondary transition">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{payment.patient}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{payment.doctor}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{payment.amount}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{payment.method}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {payment.status === "completed" ? "Completado" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

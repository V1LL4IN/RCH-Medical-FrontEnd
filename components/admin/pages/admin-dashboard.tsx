"use client"

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Stethoscope, Calendar, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react"

const dashboardStats = [
  {
    label: "Total Pacientes",
    value: "1,245",
    change: "+12%",
    icon: Users,
    color: "primary",
  },
  {
    label: "Total Doctores",
    value: "48",
    change: "+3",
    icon: Stethoscope,
    color: "primary",
  },
  {
    label: "Citas Este Mes",
    value: "342",
    change: "+8%",
    icon: Calendar,
    color: "primary",
  },
  {
    label: "Ingresos",
    value: "$24,580",
    change: "+15%",
    icon: CreditCard,
    color: "primary",
  },
]

const appointmentsData = [
  { mes: "Ene", citas: 240, completadas: 221 },
  { mes: "Feb", citas: 380, completadas: 352 },
  { mes: "Mar", citas: 200, completadas: 185 },
  { mes: "Abr", citas: 278, completadas: 264 },
  { mes: "May", citas: 189, completadas: 175 },
  { mes: "Jun", citas: 239, completadas: 223 },
]

const specialtiesData = [
  { name: "Cardiología", value: 35 },
  { name: "Ginecología", value: 28 },
  { name: "Medicina General", value: 22 },
  { name: "Odontología", value: 15 },
]

const COLORS = ["#2a5ba7", "#f59e0b", "#10b981", "#ef4444"]

const recentAppointments = [
  {
    id: 1,
    patient: "Juan Pérez García",
    doctor: "Dr. Carlos García",
    date: "2025-01-15",
    time: "2:30 PM",
    status: "completed",
  },
  {
    id: 2,
    patient: "María López Rodríguez",
    doctor: "Dra. María Rodríguez",
    date: "2025-01-14",
    time: "10:00 AM",
    status: "completed",
  },
  {
    id: 3,
    patient: "Pedro Sánchez Martinez",
    doctor: "Dr. Roberto López",
    date: "2025-01-13",
    time: "3:45 PM",
    status: "completed",
  },
]

export function AdminDashboard() {
  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
        <p className="text-muted-foreground mt-2">Bienvenido al panel de control de RCH</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change.startsWith("+")
          return (
            <Card key={stat.label} className="p-6 border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </Card>
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Appointments */}
        <Card className="lg:col-span-2 p-6 border border-border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">Citas Mensuales</h2>
            <p className="text-sm text-muted-foreground">Comparación citas programadas vs completadas</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f3f4f6",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="citas" stroke="#2a5ba7" strokeWidth={2} />
              <Line type="monotone" dataKey="completadas" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Pie Chart - Specialties */}
        <Card className="p-6 border border-border">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-foreground">Especialidades</h2>
            <p className="text-sm text-muted-foreground">Distribución de doctores</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={specialtiesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {specialtiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {specialtiesData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-muted-foreground">{item.name}</span>
                <span className="ml-auto font-semibold text-foreground">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">Citas Recientes</h2>
            <p className="text-sm text-muted-foreground">Últimas citas completadas</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Ver todas</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Paciente</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Doctor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Hora</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="border-b border-border hover:bg-secondary transition">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{appointment.patient}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{appointment.doctor}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{appointment.date}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{appointment.time}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Completada
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

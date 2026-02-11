"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Calendar } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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

const appointmentsTrendData = [
  { mes: "Ene", pacientes: 45, doctores: 8, citas: 120 },
  { mes: "Feb", pacientes: 52, doctores: 10, citas: 145 },
  { mes: "Mar", pacientes: 48, doctores: 9, citas: 130 },
  { mes: "Abr", pacientes: 61, doctores: 11, citas: 165 },
  { mes: "May", pacientes: 55, doctores: 10, citas: 150 },
  { mes: "Jun", pacientes: 68, doctores: 12, citas: 185 },
]

const specialtyDistribution = [
  { name: "Cardiología", value: 28 },
  { name: "Ginecología", value: 22 },
  { name: "Medicina General", value: 30 },
  { name: "Odontología", value: 15 },
  { name: "Psicología", value: 5 },
]

const satisfactionData = [
  { rating: "5 Estrellas", count: 45, percentage: 45 },
  { rating: "4 Estrellas", count: 35, percentage: 35 },
  { rating: "3 Estrellas", count: 15, percentage: 15 },
  { rating: "2 Estrellas", count: 4, percentage: 4 },
  { rating: "1 Estrella", count: 1, percentage: 1 },
]

const COLORS = ["#2a5ba7", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"]

export function ReportsPage() {
  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reportes y Análisis</h1>
          <p className="text-muted-foreground mt-2">Análisis detallado del desempeño de la plataforma</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card className="p-4 border border-border">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-foreground font-semibold">Período:</span>
          </div>
          <input
            type="date"
            className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm"
          />
          <span className="text-muted-foreground">a</span>
          <input
            type="date"
            className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm"
          />
          <Button variant="outline" className="border-border bg-transparent">
            Aplicar
          </Button>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Trend */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Tendencia de Citas y Usuarios</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pacientes" stroke="#2a5ba7" strokeWidth={2} name="Pacientes" />
              <Line type="monotone" dataKey="citas" stroke="#10b981" strokeWidth={2} name="Citas" />
              <Line type="monotone" dataKey="doctores" stroke="#f59e0b" strokeWidth={2} name="Doctores" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Specialty Distribution */}
        <Card className="p-6 border border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Distribución por Especialidad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={specialtyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {specialtyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {specialtyDistribution.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Satisfaction Rating */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Calificación de Satisfacción</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={satisfactionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="rating" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="count" fill="#2a5ba7" name="Cantidad de Pacientes" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Citas Completadas Este Mes</p>
          <p className="text-3xl font-bold text-foreground">342</p>
          <p className="text-xs text-green-600 mt-2">+12% respecto al mes anterior</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Pacientes Nuevos Este Mes</p>
          <p className="text-3xl font-bold text-foreground">68</p>
          <p className="text-xs text-green-600 mt-2">+23% respecto al mes anterior</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Rating Promedio Plataforma</p>
          <p className="text-3xl font-bold text-foreground">4.7</p>
          <p className="text-xs text-yellow-600 mt-2">⭐⭐⭐⭐⭐</p>
        </Card>
        <Card className="p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Tasa de Retención</p>
          <p className="text-3xl font-bold text-foreground">87%</p>
          <p className="text-xs text-green-600 mt-2">+5% respecto al mes anterior</p>
        </Card>
      </div>
    </div>
  )
}

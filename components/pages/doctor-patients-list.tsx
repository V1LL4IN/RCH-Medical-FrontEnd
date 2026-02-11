"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Mail, Phone, Calendar } from "lucide-react"

const patients = [
  {
    id: 1,
    name: "Juan Pérez García",
    age: 35,
    email: "juan.perez@email.com",
    phone: "+1 (555) 123-4567",
    lastVisit: "2025-01-15",
    nextAppointment: "2025-01-20",
    medicalHistory: ["Hipertensión", "Colesterol elevado"],
  },
  {
    id: 2,
    name: "María López Rodríguez",
    age: 42,
    email: "maria.lopez@email.com",
    phone: "+1 (555) 234-5678",
    lastVisit: "2025-01-10",
    nextAppointment: "2025-01-25",
    medicalHistory: ["Post-operatorio", "Diabetes tipo 2"],
  },
  {
    id: 3,
    name: "Pedro Sánchez Martinez",
    age: 58,
    email: "pedro.sanchez@email.com",
    phone: "+1 (555) 345-6789",
    lastVisit: "2024-12-28",
    nextAppointment: "2025-02-01",
    medicalHistory: ["Hipertensión arterial", "Obesidad"],
  },
]

export function DoctorPatientsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Mis Pacientes</h1>
            <p className="text-muted-foreground">Gestiona el historial de tus pacientes</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Agregar Paciente</Button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Patients list */}
        <div className="space-y-4">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                {/* Patient info */}
                <div className="md:col-span-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">{patient.age} años</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {patient.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {patient.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical history */}
                <div className="md:col-span-1">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">ANTECEDENTES</p>
                  <div className="space-y-1">
                    {patient.medicalHistory.map((item) => (
                      <p key={item} className="text-xs bg-secondary rounded px-2 py-1 text-foreground">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Dates */}
                <div className="md:col-span-1">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">ÚLTIMA VISITA</p>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        {new Date(patient.lastVisit).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-1">PRÓXIMA CITA</p>
                      <div className="flex items-center gap-2 text-sm text-primary font-semibold">
                        <Calendar className="w-4 h-4" />
                        {new Date(patient.nextAppointment).toLocaleDateString("es-ES")}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex gap-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90">
                    Ver Historial
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent border-border">
                    Editar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No se encontraron pacientes</p>
          </div>
        )}
      </div>
    </section>
  )
}

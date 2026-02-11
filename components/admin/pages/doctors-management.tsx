"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DoctorForm } from "@/components/admin/forms/doctor-form"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiDoctor, ApiSpecialty, CreateDoctorDto, UpdateDoctorDto, DoctorStatus } from "@/lib/types"

const statusLabels: Record<DoctorStatus, { label: string; className: string }> = {
  Activo: { label: "Activo", className: "bg-green-100 text-green-800" },
  Inactivo: { label: "Inactivo", className: "bg-gray-100 text-gray-800" },
  DeVacaciones: { label: "De Vacaciones", className: "bg-yellow-100 text-yellow-800" },
}

export function DoctorsManagement() {
  const [doctors, setDoctors] = useState<ApiDoctor[]>([])
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<ApiDoctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Load doctors and specialties on mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [doctorsData, specialtiesData] = await Promise.all([
        browserApiClient.getDoctors(),
        browserApiClient.getSpecialties(),
      ])
      // Ensure data is an array
      setDoctors(Array.isArray(doctorsData) ? doctorsData : [])
      setSpecialties(Array.isArray(specialtiesData) ? specialtiesData : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos")
      setDoctors([])
      setSpecialties([])
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = (doctors || []).filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddDoctor = async (doctorData: CreateDoctorDto) => {
    try {
      setSubmitting(true)
      const newDoctor = await browserApiClient.createDoctor(doctorData)
      setDoctors([...doctors, newDoctor])
      setOpenDialog(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear doctor")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditDoctor = async (doctorData: UpdateDoctorDto) => {
    if (!editingDoctor) return
    try {
      setSubmitting(true)
      const updatedDoctor = await browserApiClient.updateDoctor(editingDoctor.id, doctorData)
      setDoctors(doctors.map((d) => (d.id === editingDoctor.id ? updatedDoctor : d)))
      setEditingDoctor(null)
      setOpenDialog(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar doctor")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este doctor?")) return

    try {
      await browserApiClient.deleteDoctor(id)
      setDoctors(doctors.filter((d) => d.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar doctor")
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando doctores...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <div>
            <p className="text-lg font-semibold text-foreground">Error al cargar datos</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <Button onClick={loadData} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Doctores</h1>
          <p className="text-muted-foreground mt-2">Administra los doctores de la plataforma</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingDoctor(null)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Editar Doctor" : "Agregar Nuevo Doctor"}</DialogTitle>
            </DialogHeader>
            <DoctorForm
              doctor={editingDoctor}
              specialties={specialties}
              onSubmit={editingDoctor ? handleEditDoctor : handleAddDoctor}
              onClose={() => setOpenDialog(false)}
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="p-4 border border-border">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, especialidad o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </Card>

      {/* Doctors Table */}
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Especialidad</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Experiencia</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-b border-border hover:bg-secondary transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {doctor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{doctor.name}</p>
                        <p className="text-xs text-muted-foreground">{doctor.phone || "Sin teléfono"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doctor.specialty.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{doctor.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{doctor.experienceYears} años</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-foreground">{doctor.rating}</span>
                      <span className="text-yellow-500">⭐</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusLabels[doctor.status].className}`}>
                      {statusLabels[doctor.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setEditingDoctor(doctor)
                          setOpenDialog(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDoctors.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron doctores</p>
          </div>
        )}
      </Card>
    </div>
  )
}

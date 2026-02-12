"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import type { ApiDoctor, ApiSpecialty, CreateDoctorDto, UpdateDoctorDto, DoctorStatus } from "@/lib/types"

interface DoctorFormProps {
  doctor: ApiDoctor | null
  specialties: ApiSpecialty[]
  initialImage?: string | null
  onSubmit: (data: (CreateDoctorDto | UpdateDoctorDto) & { image?: File | null }) => void
  onClose: () => void
  submitting?: boolean
}

export function DoctorForm({ doctor, specialties, initialImage, onSubmit, onClose, submitting = false }: DoctorFormProps) {
  const [formData, setFormData] = useState({
    name: doctor?.name || "",
    email: doctor?.email || "",
    phone: doctor?.phone || "",
    experienceYears: doctor?.experienceYears?.toString() || "",
    specialtyId: doctor?.specialty?.id || "",
    status: doctor?.status || "Activo" as DoctorStatus,
    image: null as File | null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.specialtyId || !formData.email) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const data: (CreateDoctorDto | UpdateDoctorDto) & { image?: File | null } = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      experienceYears: parseInt(formData.experienceYears) || 0,
      specialtyId: formData.specialtyId,
      status: formData.status as DoctorStatus,
      image: formData.image,
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Upload Column */}
        <div className="md:col-span-2 flex justify-center pb-4">
          <div className="space-y-2 text-center">
            <Label className="text-foreground">Foto de Perfil</Label>
            <div className="flex justify-center p-4 border rounded-lg border-border bg-secondary/30">
              <ImageUpload
                value={initialImage || null}
                onChange={(file) => setFormData((prev) => ({ ...prev, image: file }))}
                onRemove={() => setFormData((prev) => ({ ...prev, image: null }))}
                disabled={submitting}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Nombre Completo *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Dr. Juan Pérez"
            className="border-border bg-secondary"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialtyId" className="text-foreground">
            Especialidad *
          </Label>
          <Select
            value={formData.specialtyId}
            onValueChange={(value) => handleSelectChange("specialtyId", value)}
            disabled={submitting}
          >
            <SelectTrigger className="border-border bg-secondary">
              <SelectValue placeholder="Selecciona una especialidad" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {specialties.length === 0 && (
            <p className="text-xs text-amber-600">
              No hay especialidades disponibles. Crea una primero.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="doctor@clinica.com"
            className="border-border bg-secondary"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Teléfono
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+593 99 999 9999"
            className="border-border bg-secondary"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceYears" className="text-foreground">
            Años de Experiencia
          </Label>
          <Input
            id="experienceYears"
            name="experienceYears"
            type="number"
            min="0"
            value={formData.experienceYears}
            onChange={handleChange}
            placeholder="10"
            className="border-border bg-secondary"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-foreground">
            Estado
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange("status", value)}
            disabled={submitting}
          >
            <SelectTrigger className="border-border bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Activo">Activo</SelectItem>
              <SelectItem value="Inactivo">Inactivo</SelectItem>
              <SelectItem value="DeVacaciones">De Vacaciones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-border bg-transparent"
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90"
          disabled={submitting || specialties.length === 0}
        >
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {doctor ? "Guardar Cambios" : "Crear Doctor"}
        </Button>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import type { ApiSpecialty, CreateSpecialtyDto, UpdateSpecialtyDto } from "@/lib/types"

interface SpecialtyFormProps {
  specialty: ApiSpecialty | null
  onSubmit: (data: CreateSpecialtyDto | UpdateSpecialtyDto) => void
  onClose: () => void
  submitting?: boolean
}

export function SpecialtyForm({ specialty, onSubmit, onClose, submitting = false }: SpecialtyFormProps) {
  const [formData, setFormData] = useState({
    name: specialty?.name || "",
    description: specialty?.description || "",
    imageUrl: specialty?.imageUrl || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description) {
      alert("Por favor completa todos los campos requeridos")
      return
    }
    onSubmit({
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Nombre de la Especialidad *
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Cardiología"
          className="border-border bg-secondary"
          disabled={submitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-foreground">
          Descripción *
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción detallada de la especialidad..."
          rows={4}
          className="border-border bg-secondary"
          disabled={submitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-foreground">
          URL de Imagen
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/imagen.jpg o /imagen-local.jpg"
          className="border-border bg-secondary"
          disabled={submitting}
        />
        <p className="text-xs text-muted-foreground">
          Puede ser una URL externa o una ruta local (ej: /cardiologia.jpg)
        </p>
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
          disabled={submitting}
        >
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {specialty ? "Guardar Cambios" : "Crear Especialidad"}
        </Button>
      </div>
    </form>
  )
}

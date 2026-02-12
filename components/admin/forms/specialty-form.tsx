"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import type { ApiSpecialty, CreateSpecialtyDto, UpdateSpecialtyDto } from "@/lib/types"

interface SpecialtyFormProps {
  specialty: ApiSpecialty | null
  onSubmit: (data: FormData) => void
  onClose: () => void
  submitting?: boolean
}

export function SpecialtyForm({ specialty, onSubmit, onClose, submitting = false }: SpecialtyFormProps) {
  const [formData, setFormData] = useState({
    name: specialty?.name || "",
    description: specialty?.description || "",
    image: null as File | null,
  })

  // Keep track of original image URL for the preview
  const initialImageUrl = specialty?.imageUrl || null

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

    const data = new FormData()
    data.append("name", formData.name)
    data.append("description", formData.description)
    if (formData.image) {
      data.append("image", formData.image)
    }

    // If we're updating and didn't change the image, we don't need to send it
    // But if we're creating, we might send it if it exists. 
    // The API handles optional image.

    onSubmit(data)
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
        <Label className="text-foreground">Imagen de la Especialidad</Label>
        <div className="flex justify-center p-4 border rounded-lg border-border bg-secondary/30">
          <ImageUpload
            value={initialImageUrl}
            onChange={(file) => setFormData((prev) => ({ ...prev, image: file }))}
            onRemove={() => setFormData((prev) => ({ ...prev, image: null }))}
            disabled={submitting}
          />
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
          disabled={submitting}
        >
          {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {specialty ? "Guardar Cambios" : "Crear Especialidad"}
        </Button>
      </div>
    </form>
  )
}

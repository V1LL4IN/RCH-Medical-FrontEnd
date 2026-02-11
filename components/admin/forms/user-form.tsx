"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ApiUser, CreateUserDto, UpdateUserDto, UserStatus } from "@/lib/types"

interface UserFormProps {
  user: ApiUser | null
  onSubmit: (data: CreateUserDto | UpdateUserDto) => void
  onClose: () => void
  submitting?: boolean
}

export function UserForm({ user, onSubmit, onClose, submitting = false }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    status: user?.status || "Activo" as UserStatus,
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
    if (!formData.email || (!user && !formData.password)) {
      alert("Por favor completa todos los campos requeridos")
      return
    }

    const submitData: CreateUserDto | UpdateUserDto = {
      name: formData.name || undefined,
      email: formData.email,
      status: formData.status as UserStatus,
    }

    // Only include password if creating or if explicitly set
    if (!user && formData.password) {
      (submitData as CreateUserDto).password = formData.password
    } else if (user && formData.password) {
      (submitData as UpdateUserDto).password = formData.password
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-foreground">
            Nombre Completo
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Juan Pérez García"
            className="border-border bg-secondary"
            disabled={submitting}
          />
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
            placeholder="usuario@email.com"
            className="border-border bg-secondary"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground">
            {user ? "Nueva Contraseña (dejar vacío para mantener)" : "Contraseña *"}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
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
              <SelectItem value="Suspendido">Suspendido</SelectItem>
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
          disabled={submitting}
        >
          {submitting ? "Guardando..." : user ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </div>
    </form>
  )
}

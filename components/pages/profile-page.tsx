"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { currentUser, updateUser } = useStore()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cedula: "",
  })

  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    } else {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        cedula: currentUser.cedula || "",
      })
    }
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser(currentUser.id, formData)
    toast({
      title: "Perfil actualizado",
      description: "Tus datos han sido actualizados correctamente.",
    })
  }

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Dashboard
        </Link>

        <div className="bg-card border border-border rounded-xl p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Editar Perfil</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-input border-border"
                disabled
              />
              <p className="text-xs text-muted-foreground mt-1">El correo no puede ser modificado</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Cédula de Identidad</label>
              <Input
                type="text"
                value={formData.cedula}
                onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Teléfono</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

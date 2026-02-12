"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Users, CheckCircle, Loader2, Stethoscope, Save } from "lucide-react"
import { browserApiClient } from "@/lib/api-client-browser"
import { ImageUpload } from "@/components/ui/image-upload"
import type { ApiDoctor, ApiUser } from "@/lib/types"

export function DoctorDashboard() {
  const { data: session, update: updateSession } = useSession()
  const currentUser = session?.user
  const [doctor, setDoctor] = useState<ApiDoctor | null>(null)
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!currentUser?.doctorId || !currentUser?.id) {
        setLoading(false)
        return
      }
      try {
        const [doctorData, userData] = await Promise.all([
          browserApiClient.getDoctorById(currentUser.doctorId),
          browserApiClient.getUserById(currentUser.id)
        ])
        setDoctor(doctorData)
        setUser(userData)
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [currentUser?.doctorId, currentUser?.id])

  const handleSaveImage = async () => {
    if (!selectedImage || !currentUser?.id) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append("image", selectedImage)

      await browserApiClient.updateUser(currentUser.id, formData)

      // Refresh user data
      const updatedUser = await browserApiClient.getUserById(currentUser.id)
      setUser(updatedUser)
      setSelectedImage(null)

      // Update session if possible to reflect new image across app
      await updateSession({ user: { ...currentUser, image: updatedUser.image } })

      alert("Foto de perfil actualizada correctamente")
    } catch (err) {
      console.error("Error updating image:", err)
      alert("Error al actualizar la foto de perfil")
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-background">
      {/* Header with doctor profile */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg bg-background">
            {user ? (
              <ImageUpload
                value={user.image || null}
                onChange={setSelectedImage}
                onRemove={() => setSelectedImage(null)}
                className="w-full h-full [&>div]:w-full [&>div]:h-full [&>div]:border-none [&>div]:rounded-none"
              />
            ) : (
              <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">
                  {currentUser?.name?.split(" ").map(n => n[0]).slice(0, 2).join("") || "D"}
                </span>
              </div>
            )}
          </div>
          {selectedImage && (
            <Button
              size="sm"
              onClick={handleSaveImage}
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
              Guardar Foto
            </Button>
          )}
        </div>

        <div className="flex-1 text-center md:text-left pt-2">
          <h1 className="text-3xl font-bold text-foreground mb-2">{currentUser?.name}</h1>
          <p className="text-primary font-semibold mb-1">{doctor?.specialty?.name || "Especialista"}</p>
          <p className="text-muted-foreground">Red Cedco Health - Portal Médico</p>
          {doctor && (
            <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                {doctor.experienceYears} años de experiencia
              </span>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                ⭐ {doctor.rating} rating
              </span>
              <span className={`text-xs px-3 py-1 rounded-full ${doctor.status === "Activo"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}>
                {doctor.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Especialidad</p>
              <p className="text-xl font-bold text-foreground">{doctor?.specialty?.name || "—"}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Experiencia</p>
              <p className="text-xl font-bold text-foreground">{doctor?.experienceYears || 0} años</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rating</p>
              <p className="text-xl font-bold text-foreground">{doctor?.rating || 0} ⭐</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estado</p>
              <p className="text-xl font-bold text-foreground">{doctor?.status || "—"}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="p-6 border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">Información del Perfil</h2>
        {doctor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nombre completo</p>
              <p className="font-medium text-foreground">{doctor.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <p className="font-medium text-foreground">{doctor.email}</p>
            </div>
            {doctor.phone && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teléfono</p>
                <p className="font-medium text-foreground">{doctor.phone}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Especialidad</p>
              <p className="font-medium text-foreground">{doctor.specialty.name}</p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No se pudo cargar la información del perfil</p>
        )}
      </Card>
    </div>
  )
}

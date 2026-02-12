"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, Copy, CheckCircle, KeyRound } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DoctorForm } from "@/components/admin/forms/doctor-form"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiDoctor, ApiSpecialty, ApiUser, CreateDoctorDto, UpdateDoctorDto, DoctorStatus } from "@/lib/types"

const statusLabels: Record<DoctorStatus, { label: string; className: string }> = {
  Activo: { label: "Activo", className: "bg-green-100 text-green-800" },
  Inactivo: { label: "Inactivo", className: "bg-gray-100 text-gray-800" },
  DeVacaciones: { label: "De Vacaciones", className: "bg-yellow-100 text-yellow-800" },
}

function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  let password = ""
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export function DoctorsManagement() {
  const [doctors, setDoctors] = useState<ApiDoctor[]>([])
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<ApiDoctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Credentials dialog state
  const [credentialsDialog, setCredentialsDialog] = useState(false)
  const [tempCredentials, setTempCredentials] = useState<{ email: string; password: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [doctorsData, specialtiesData, usersData] = await Promise.all([
        browserApiClient.getDoctors(),
        browserApiClient.getSpecialties(),
        browserApiClient.getUsers(),
      ])
      const safeUsers = Array.isArray(usersData) ? usersData : []

      // Enrich doctors with user relation since GET /doctors/ doesn't include it
      const safeDoctors = (Array.isArray(doctorsData) ? doctorsData : []).map((doctor) => {
        if (doctor.user) return doctor
        // Find the user that has this doctor linked
        const linkedUser = safeUsers.find((u) => u.doctor?.id === doctor.id)
        if (linkedUser) {
          return {
            ...doctor,
            user: { id: linkedUser.id, name: linkedUser.name || "", email: linkedUser.email },
          }
        }
        return doctor
      })

      setDoctors(safeDoctors)
      setSpecialties(Array.isArray(specialtiesData) ? specialtiesData : [])
      setUsers(safeUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos")
      setDoctors([])
      setSpecialties([])
      setUsers([])
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

  const handleAddDoctor = async (data: (CreateDoctorDto) & { image?: File | null }) => {
    try {
      setSubmitting(true)

      // Step 1: Generate temp password
      const tempPassword = generateTempPassword()

      // Step 2: Create User account via signup API (hashes password with bcrypt)
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: tempPassword,
        }),
      })

      if (!signupRes.ok) {
        const signupError = await signupRes.json()
        throw new Error(signupError.error || "Error al crear cuenta de usuario para el doctor")
      }

      const userData = await signupRes.json()

      // Step 2.5: Upload Image if present
      if (data.image) {
        try {
          const formData = new FormData()
          formData.append("image", data.image)
          await browserApiClient.updateUser(userData.id, formData)
          // Refresh users to get the new image
          const updatedUsers = await browserApiClient.getUsers()
          setUsers(updatedUsers)
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError)
          alert("Doctor creado, pero hubo un error al subir la imagen.")
        }
      }

      // Step 3: Create Doctor linked to the User
      // Remove image from data passed to createDoctor
      const { image, ...doctorData } = data
      await browserApiClient.createDoctor({
        ...doctorData,
        userId: userData.id,
      })

      // Step 4: Reload all data to get complete doctor with user relation and image
      await loadData()
      setOpenDialog(false)

      // Step 5: Show credentials dialog
      setTempCredentials({ email: data.email, password: tempPassword })
      setCopied(false)
      setCredentialsDialog(true)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear doctor")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditDoctor = async (data: (UpdateDoctorDto) & { image?: File | null }) => {
    if (!editingDoctor) return
    try {
      setSubmitting(true)

      const { image, ...doctorData } = data

      // Step 1: Update Doctor info
      await browserApiClient.updateDoctor(editingDoctor.id, doctorData)

      // Step 2: Update User Image if present and doctor has a user
      const doctorUserId = editingDoctor.user?.id
      if (image && doctorUserId) {
        try {
          const formData = new FormData()
          formData.append("image", image)
          await browserApiClient.updateUser(doctorUserId, formData)
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError)
          alert("Datos actualizados, pero error al subir imagen.")
        }
      } else if (image && !doctorUserId) {
        alert("Este doctor no tiene un usuario asociado, no se puede subir la imagen.")
      }

      // Step 3: Reload all data to get fresh relations and images
      await loadData()
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
      // Find the associated user before deleting the doctor
      const doctor = doctors.find((d) => d.id === id)
      const userId = doctor?.user?.id

      // Delete the doctor first
      await browserApiClient.deleteDoctor(id)

      // Then delete the associated user account if it exists
      if (userId) {
        try {
          await browserApiClient.deleteUser(userId)
        } catch (userErr) {
          console.error("Error deleting associated user:", userErr)
        }
      }

      await loadData()
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar doctor")
    }
  }

  const handleCopyCredentials = () => {
    if (!tempCredentials) return
    const text = `Email: ${tempCredentials.email}\nContraseña temporal: ${tempCredentials.password}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const getDoctorImage = (doctor: ApiDoctor) => {
    if (!doctor.user?.id) return null
    const user = users.find(u => u.id === doctor.user?.id)
    return user?.image || null
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
              initialImage={editingDoctor ? getDoctorImage(editingDoctor) : null}
              onSubmit={(data) => {
                if (editingDoctor) {
                  handleEditDoctor(data as UpdateDoctorDto & { image?: File | null })
                } else {
                  handleAddDoctor(data as CreateDoctorDto & { image?: File | null })
                }
              }}
              onClose={() => setOpenDialog(false)}
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Credentials Dialog */}
      <Dialog open={credentialsDialog} onOpenChange={setCredentialsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-primary" />
              Credenciales de Acceso
            </DialogTitle>
          </DialogHeader>
          {tempCredentials && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium mb-1">Doctor creado exitosamente</p>
                <p className="text-xs text-green-700">
                  Se generó una contraseña temporal. Compártela con el doctor para que pueda acceder al sistema.
                </p>
              </div>

              <div className="bg-secondary rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-mono text-sm font-semibold text-foreground">{tempCredentials.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Contraseña temporal</p>
                  <p className="font-mono text-sm font-semibold text-foreground">{tempCredentials.password}</p>
                </div>
              </div>

              <Button
                onClick={handleCopyCredentials}
                variant="outline"
                className="w-full gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Copiado al portapapeles
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar credenciales
                  </>
                )}
              </Button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Importante:</strong> Esta contraseña se muestra solo una vez. Asegúrate de copiarla y compartirla con el doctor de forma segura.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Acceso</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => {
                const doctorImage = getDoctorImage(doctor)

                return (
                  <tr key={doctor.id} className="border-b border-border hover:bg-secondary transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                          {doctorImage ? (
                            <img src={doctorImage} alt={doctor.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-primary font-semibold text-sm">
                              {doctor.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </span>
                          )}
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
                      {doctor.user ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Sin cuenta
                        </span>
                      )}
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
                )
              })}
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

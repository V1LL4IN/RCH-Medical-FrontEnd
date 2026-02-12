"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SpecialtyForm } from "@/components/admin/forms/specialty-form"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiSpecialty, CreateSpecialtyDto, UpdateSpecialtyDto } from "@/lib/types"

export function SpecialtiesManagement() {
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState<ApiSpecialty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Load specialties on mount
  useEffect(() => {
    loadSpecialties()
  }, [])

  const loadSpecialties = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await browserApiClient.getSpecialties()
      // Ensure data is an array
      setSpecialties(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar especialidades")
      setSpecialties([])
    } finally {
      setLoading(false)
    }
  }

  const filteredSpecialties = (specialties || []).filter(
    (specialty) =>
      specialty.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialty.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSpecialty = async (specialtyData: CreateSpecialtyDto | FormData) => {
    try {
      setSubmitting(true)
      const newSpecialty = await browserApiClient.createSpecialty(specialtyData)
      setSpecialties([...specialties, newSpecialty])
      setOpenDialog(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear especialidad")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSpecialty = async (specialtyData: UpdateSpecialtyDto | FormData) => {
    if (!editingSpecialty) return
    try {
      setSubmitting(true)
      const updatedSpecialty = await browserApiClient.updateSpecialty(editingSpecialty.id, specialtyData)
      setSpecialties(specialties.map((s) => (s.id === editingSpecialty.id ? updatedSpecialty : s)))
      setEditingSpecialty(null)
      setOpenDialog(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar especialidad")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSpecialty = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar esta especialidad?")) return

    try {
      await browserApiClient.deleteSpecialty(id)
      setSpecialties(specialties.filter((s) => s.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al eliminar especialidad. Asegúrese de que no tenga doctores asignados.")
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando especialidades...</p>
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
          <Button onClick={loadSpecialties} variant="outline">
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
          <h1 className="text-3xl font-bold text-foreground">Gestión de Especialidades</h1>
          <p className="text-muted-foreground mt-2">Administra las especialidades médicas disponibles</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingSpecialty(null)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Especialidad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSpecialty ? "Editar Especialidad" : "Agregar Nueva Especialidad"}</DialogTitle>
            </DialogHeader>
            <SpecialtyForm
              specialty={editingSpecialty}
              onSubmit={editingSpecialty ? handleEditSpecialty : handleAddSpecialty}
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
            placeholder="Buscar especialidades..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </Card>

      {/* Specialties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecialties.map((specialty) => (
          <Card key={specialty.id} className="border border-border overflow-hidden hover:shadow-lg transition">
            <img
              src={specialty.imageUrl || "/placeholder.svg"}
              alt={specialty.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-foreground mb-2">{specialty.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{specialty.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-foreground">
                  {specialty._count?.doctors || 0} doctores
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-blue-600 hover:text-blue-700"
                  onClick={() => {
                    setEditingSpecialty(specialty)
                    setOpenDialog(true)
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-red-600 hover:text-red-700"
                  onClick={() => handleDeleteSpecialty(specialty.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSpecialties.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No se encontraron especialidades</p>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Shield, User, Stethoscope, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { UserForm } from "@/components/admin/forms/user-form"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiUser, CreateUserDto, UpdateUserDto, UserStatus } from "@/lib/types"

const statusLabels: Record<UserStatus, string> = {
  Activo: "Activo",
  Inactivo: "Inactivo",
  Suspendido: "Suspendido",
}

const statusColors: Record<UserStatus, string> = {
  Activo: "bg-green-100 text-green-800",
  Inactivo: "bg-gray-100 text-gray-800",
  Suspendido: "bg-red-100 text-red-800",
}

export function UsersManagement() {
  const [users, setUsers] = useState<ApiUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await browserApiClient.getUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = (users || []).filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by role based on admin/doctor relations
    let matchesRole = filterRole === "all"
    if (filterRole === "admin" && user.admin) matchesRole = true
    if (filterRole === "doctor" && user.doctor) matchesRole = true
    if (filterRole === "patient" && !user.admin && !user.doctor) matchesRole = true

    return matchesSearch && matchesRole
  })

  const handleAddUser = async (userData: CreateUserDto) => {
    try {
      setSubmitting(true)
      const newUser = await browserApiClient.createUser(userData)
      setUsers([...users, newUser])
      setOpenDialog(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al crear usuario")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditUser = async (userData: UpdateUserDto) => {
    if (!editingUser) return
    try {
      setSubmitting(true)
      const updatedUser = await browserApiClient.updateUser(editingUser.id, userData)
      setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)))
      setEditingUser(null)
      setOpenDialog(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al actualizar usuario")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este usuario? Esta acción es irreversible.")) {
      try {
        await browserApiClient.deleteUser(id)
        setUsers(users.filter((u) => u.id !== id))
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al eliminar usuario")
      }
    }
  }

  const getUserRole = (user: ApiUser): string => {
    if (user.admin) return "admin"
    if (user.doctor) return "doctor"
    return "patient"
  }

  const getRoleLabel = (user: ApiUser): string => {
    if (user.admin) return "Administrador"
    if (user.doctor) return "Doctor"
    return "Paciente"
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-lg text-muted-foreground">{error}</p>
          <Button onClick={loadUsers} variant="outline">
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
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-2">Administra los usuarios de la plataforma</p>
        </div>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingUser(null)
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Editar Usuario" : "Agregar Nuevo Usuario"}</DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSubmit={editingUser ? handleEditUser : handleAddUser}
              onClose={() => setOpenDialog(false)}
              submitting={submitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4 border border-border space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-secondary text-foreground text-sm"
          >
            <option value="all">Todos los roles</option>
            <option value="patient">Pacientes</option>
            <option value="doctor">Doctores</option>
            <option value="admin">Administradores</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rol</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha de Registro</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-secondary transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {user.name?.split(" ").map(n => n[0]).slice(0, 2).join("") || user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{user.name || "Sin nombre"}</p>
                        {user.doctor?.specialty?.name && (
                          <p className="text-xs text-muted-foreground">{user.doctor.specialty.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {user.admin ? (
                        <Shield className="w-4 h-4 text-purple-600" />
                      ) : user.doctor ? (
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                      ) : (
                        <User className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-sm font-semibold text-foreground">{getRoleLabel(user)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("es-ES") : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusColors[user.status] || "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {statusLabels[user.status] || user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setEditingUser(user)
                          setOpenDialog(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteUser(user.id)}
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
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron usuarios</p>
          </div>
        )}
      </Card>
    </div>
  )
}

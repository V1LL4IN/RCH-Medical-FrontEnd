"use client"

import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"

export function AppointmentsManagement() {
  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Gestión de Citas</h1>
        <p className="text-muted-foreground mt-2">Administra todas las citas de la plataforma</p>
      </div>

      {/* Empty State */}
      <Card className="p-12 border border-border">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Módulo en desarrollo</h2>
          <p className="text-muted-foreground max-w-md">
            La gestión de citas estará disponible próximamente. Este módulo permitirá visualizar, gestionar y dar seguimiento a todas las citas de la plataforma.
          </p>
        </div>
      </Card>
    </div>
  )
}

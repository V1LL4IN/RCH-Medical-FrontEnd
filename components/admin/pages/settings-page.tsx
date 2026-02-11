"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Database } from "lucide-react"

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    paymentAlerts: true,
    newRegistrations: true,
  })

  const [settings, setSettings] = useState({
    siteName: "RCH - Red de Centros Hospitalarios",
    siteEmail: "admin@rch.com",
    consultationFee: "150",
    maxBookingDays: "30",
    maintenanceMode: false,
  })

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="p-8 space-y-6 bg-background">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configuración del Sistema</h1>
        <p className="text-muted-foreground mt-2">Administra los parámetros generales de la plataforma</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="p-6 border border-border">
            <h3 className="text-lg font-bold text-foreground mb-6">Configuración General</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-foreground">Nombre del Sitio</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange("siteName", e.target.value)}
                  className="border-border bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Email del Sitio</Label>
                <Input
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => handleSettingChange("siteEmail", e.target.value)}
                  className="border-border bg-secondary"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Tarifa de Consulta por Defecto</Label>
                <Input
                  type="number"
                  value={settings.consultationFee}
                  onChange={(e) => handleSettingChange("consultationFee", e.target.value)}
                  className="border-border bg-secondary"
                  placeholder="$150"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Días Máximos para Agendar</Label>
                <Input
                  type="number"
                  value={settings.maxBookingDays}
                  onChange={(e) => handleSettingChange("maxBookingDays", e.target.value)}
                  className="border-border bg-secondary"
                  placeholder="30"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <Label className="text-foreground font-semibold">Modo de Mantenimiento</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Desactiva la plataforma para realizar mantenimiento
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(value) => handleSettingChange("maintenanceMode", value)}
                />
              </div>

              <div className="pt-6 border-t border-border">
                <Button className="bg-primary hover:bg-primary/90">Guardar Cambios</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Preferencias de Notificaciones</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label className="text-foreground font-semibold">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground mt-1">Recibe notificaciones generales por correo</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={() => handleNotificationChange("emailNotifications")}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label className="text-foreground font-semibold">Recordatorios de Citas</Label>
                  <p className="text-sm text-muted-foreground mt-1">Notifica cambios en citas programadas</p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={() => handleNotificationChange("appointmentReminders")}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label className="text-foreground font-semibold">Alertas de Pagos</Label>
                  <p className="text-sm text-muted-foreground mt-1">Notifica cuando hay pagos pendientes</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={() => handleNotificationChange("paymentAlerts")}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <Label className="text-foreground font-semibold">Nuevos Registros</Label>
                  <p className="text-sm text-muted-foreground mt-1">Notifica cuando se registran nuevos usuarios</p>
                </div>
                <Switch
                  checked={notifications.newRegistrations}
                  onCheckedChange={() => handleNotificationChange("newRegistrations")}
                />
              </div>

              <div className="pt-6 border-t border-border">
                <Button className="bg-primary hover:bg-primary/90">Guardar Preferencias</Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Configuración de Seguridad</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold text-foreground mb-4">Cambiar Contraseña</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-foreground">Contraseña Actual</Label>
                    <Input type="password" placeholder="••••••••" className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Nueva Contraseña</Label>
                    <Input type="password" placeholder="••••••••" className="border-border bg-background" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Confirmar Contraseña</Label>
                    <Input type="password" placeholder="••••••••" className="border-border bg-background" />
                  </div>
                  <Button className="bg-primary hover:bg-primary/90">Actualizar Contraseña</Button>
                </div>
              </div>

              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Sesiones Activas</h4>
                <p className="text-sm text-muted-foreground mb-4">Tienes 2 sesiones activas</p>
                <Button variant="outline" className="border-border bg-transparent">
                  Cerrar Todas las Sesiones
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="p-6 border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Sistema</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Versión del Sistema</span>
                  <span className="text-sm text-muted-foreground">v2.1.0</span>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Última Actualización</span>
                  <span className="text-sm text-muted-foreground">2025-01-10</span>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">Base de Datos</span>
                  <span className="text-sm text-muted-foreground">PostgreSQL 14</span>
                </div>
              </div>

              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-foreground">Espacio Utilizado</span>
                  <span className="text-sm text-muted-foreground">2.4 GB de 5 GB</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-primary"></div>
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-2">
                <Button className="w-full bg-primary hover:bg-primary/90">Respaldar Base de Datos</Button>
                <Button variant="outline" className="w-full border-border bg-transparent">
                  Limpiar Caché
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

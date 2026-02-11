"use client"

import { Button } from "@/components/ui/button"
import { Bell, Search, Settings, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function AdminHeader() {
  const { data: session } = useSession()
  const adminUser = session?.user

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2 max-w-md">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar doctores, pacientes..."
            className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{adminUser?.name || 'Admin RCH'}</p>
            <p className="text-xs text-muted-foreground">Administrador</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {adminUser?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>

        <Button variant="ghost" size="icon">
          <Settings className="w-5 h-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={handleLogout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </header>
  )
}

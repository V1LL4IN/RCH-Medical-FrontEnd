"use client"

import { Button } from "@/components/ui/button"
import { Bell, Settings, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function DoctorHeader() {
  const { data: session } = useSession()
  const user = session?.user

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-foreground">Portal Médico</h2>
        <p className="text-xs text-muted-foreground">Red Cedco Health</p>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-foreground">{user?.name || 'Doctor'}</p>
            <p className="text-xs text-muted-foreground">Médico</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'D'}
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

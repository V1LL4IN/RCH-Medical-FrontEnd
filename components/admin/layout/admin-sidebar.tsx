"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Zap,
  Calendar,
  CreditCard,
  FileText,
  Settings,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Gestión de Doctores",
    href: "/admin/doctores",
    icon: Stethoscope,
  },
  {
    label: "Gestión de Especialidades",
    href: "/admin/especialidades",
    icon: Zap,
  },
  {
    label: "Usuarios",
    href: "/admin/usuarios",
    icon: Users,
  },
  {
    label: "Citas",
    href: "/admin/citas",
    icon: Calendar,
  },
  {
    label: "Pagos",
    href: "/admin/pagos",
    icon: CreditCard,
  },
  {
    label: "Reportes",
    href: "/admin/reportes",
    icon: FileText,
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside
      className={`${isOpen ? "w-64" : "w-20"} border-r border-border bg-card transition-all duration-300 flex flex-col`}
    >
      <div className="h-16 border-b border-border px-6 flex items-center justify-between">
        {isOpen && (
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-rch.png" alt="RCH Logo" width={40} height={40} className="object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">RCH</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Red Cedco Health</span>
            </div>
          </Link>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="ml-auto">
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "hover:bg-accent/20 hover:text-accent"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-border p-4 ${isOpen ? "" : "text-center"}`}>
        <p className="text-xs text-muted-foreground">{isOpen ? "© 2025 RCH Medical" : "RCH"}</p>
      </div>
    </aside>
  )
}

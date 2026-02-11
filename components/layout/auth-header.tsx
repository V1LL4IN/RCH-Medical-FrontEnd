"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, User, Calendar, Shield, Store, Lock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export function AuthHeader() {
  const { data: session } = useSession()
  const currentUser = session?.user

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getDashboardLink = () => {
    switch (currentUser?.role) {
      case "patient":
        return "/dashboard"
      case "doctor":
        return "/doctor/dashboard"
      case "admin":
        return "/admin"
      case "ally":
        return "/aliado/validar"
      default:
        return "/dashboard"
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo-rch.png" alt="RCH Logo" width={50} height={50} className="w-12 h-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-none">Red Cedco Health</span>
              <span className="text-[10px] text-muted-foreground leading-none">by Sedco Salud</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition">
              Inicio
            </Link>
            <Link href="/servicios" className="text-sm text-muted-foreground hover:text-accent transition">
              Servicios
            </Link>
            <Link href="/especialidades" className="text-sm text-muted-foreground hover:text-accent transition">
              Especialidades
            </Link>
            <Link href="/medicos" className="text-sm text-muted-foreground hover:text-accent transition">
              Médicos
            </Link>
            <Link href="/membresias" className="text-sm text-muted-foreground hover:text-accent transition">
              Membresías
            </Link>
            <Link href="/promociones" className="text-sm text-muted-foreground hover:text-accent transition">
              Promociones
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hover:bg-accent/10">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(currentUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{currentUser.name || 'Usuario'}</span>
                    {currentUser.role === "patient" && currentUser.membershipActive && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 text-xs">
                        Miembro
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                      {currentUser.role === "doctor" && <Calendar className="w-4 h-4" />}
                      {currentUser.role === "admin" && <Shield className="w-4 h-4" />}
                      {currentUser.role === "ally" && <Store className="w-4 h-4" />}
                      {currentUser.role === "patient" && <User className="w-4 h-4" />}
                      {currentUser.role === "doctor" && "Mi Agenda"}
                      {currentUser.role === "admin" && "Panel Admin"}
                      {currentUser.role === "ally" && "Validar Códigos"}
                      {currentUser.role === "patient" && "Mi Dashboard"}
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === "patient" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/citas" className="flex items-center gap-2 cursor-pointer">
                          <Calendar className="w-4 h-4" />
                          Mis Citas
                        </Link>
                      </DropdownMenuItem>
                      {!currentUser.membershipActive && (
                        <DropdownMenuItem asChild>
                          <Link href="/membresias" className="flex items-center gap-2 cursor-pointer">
                            <LogOut className="w-4 h-4" />
                            Obtener Membresía
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/admin/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent hover:border-accent hover:text-accent"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="hover:border-accent hover:text-accent bg-transparent">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

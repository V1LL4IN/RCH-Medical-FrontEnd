"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

import Image from "next/image"

export function Header() {
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
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition">
              Inicio
            </Link>
            <Link href="/servicios" className="text-sm text-muted-foreground hover:text-primary transition">
              Servicios
            </Link>
            <Link href="/especialidades" className="text-sm text-muted-foreground hover:text-primary transition">
              Especialidades
            </Link>
            <Link href="/medicos" className="text-sm text-muted-foreground hover:text-primary transition">
              Médicos
            </Link>
            <Link href="/membresias" className="text-sm text-muted-foreground hover:text-primary transition">
              Membresías
            </Link>
            <Link href="/promociones" className="text-sm text-muted-foreground hover:text-primary transition">
              Promociones
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm" className="bg-transparent">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

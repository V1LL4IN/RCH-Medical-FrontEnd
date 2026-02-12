"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell, Search, Settings, LogOut, Stethoscope, Users, Zap, Loader2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { browserApiClient } from "@/lib/api-client-browser"
import type { ApiDoctor, ApiUser, ApiSpecialty } from "@/lib/types"

interface SearchResult {
  id: string
  label: string
  sublabel: string
  type: "doctor" | "user" | "specialty"
  href: string
}

export function AdminHeader() {
  const { data: session } = useSession()
  const adminUser = session?.user
  const router = useRouter()

  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [doctors, setDoctors] = useState<ApiDoctor[]>([])
  const [users, setUsers] = useState<ApiUser[]>([])
  const [specialties, setSpecialties] = useState<ApiSpecialty[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load data on first focus
  const loadData = useCallback(async () => {
    if (dataLoaded) return
    setLoading(true)
    try {
      const [d, u, s] = await Promise.all([
        browserApiClient.getDoctors(),
        browserApiClient.getUsers(),
        browserApiClient.getSpecialties(),
      ])
      setDoctors(d)
      setUsers(u)
      setSpecialties(s)
      setDataLoaded(true)
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [dataLoaded])

  // Filter results when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const q = query.toLowerCase()
    const matched: SearchResult[] = []

    for (const d of doctors) {
      if (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.specialty.name.toLowerCase().includes(q)
      ) {
        matched.push({
          id: d.id,
          label: d.name,
          sublabel: d.specialty.name,
          type: "doctor",
          href: "/admin/doctores",
        })
      }
      if (matched.length >= 10) break
    }

    for (const u of users) {
      if (
        (u.name && u.name.toLowerCase().includes(q)) ||
        u.email.toLowerCase().includes(q)
      ) {
        matched.push({
          id: u.id,
          label: u.name || u.email,
          sublabel: u.email,
          type: "user",
          href: "/admin/usuarios",
        })
      }
      if (matched.length >= 15) break
    }

    for (const s of specialties) {
      if (s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)) {
        matched.push({
          id: s.id,
          label: s.name,
          sublabel: s.description,
          type: "specialty",
          href: "/admin/especialidades",
        })
      }
      if (matched.length >= 20) break
    }

    setResults(matched)
  }, [query, doctors, users, specialties])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery("")
    router.push(result.href)
  }

  const iconForType = (type: SearchResult["type"]) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="w-4 h-4 text-primary" />
      case "user":
        return <Users className="w-4 h-4 text-primary" />
      case "specialty":
        return <Zap className="w-4 h-4 text-primary" />
    }
  }

  const labelForType = (type: SearchResult["type"]) => {
    switch (type) {
      case "doctor":
        return "Doctor"
      case "user":
        return "Usuario"
      case "specialty":
        return "Especialidad"
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex-1 flex items-center gap-4">
        <div ref={containerRef} className="relative max-w-md w-full">
          <div className="flex items-center gap-2 bg-secondary rounded-lg px-4 py-2">
            {loading ? (
              <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-muted-foreground" />
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar doctores, pacientes, especialidades..."
              className="bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => {
                loadData()
                if (query.trim()) setOpen(true)
              }}
            />
          </div>

          {open && query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {loading && !dataLoaded ? (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cargando datos...
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  No se encontraron resultados para &quot;{query}&quot;
                </div>
              ) : (
                results.map((r) => (
                  <button
                    key={`${r.type}-${r.id}`}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary transition-colors border-b border-border last:border-b-0"
                    onClick={() => handleSelect(r)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {iconForType(r.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{r.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{r.sublabel}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full shrink-0">
                      {labelForType(r.type)}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
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

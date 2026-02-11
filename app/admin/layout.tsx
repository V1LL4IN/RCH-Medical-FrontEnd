"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { AdminHeader } from "@/components/admin/layout/admin-header"
import { AdminSidebar } from "@/components/admin/layout/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    // Allow access to login page
    if (pathname === "/admin/login") {
      return
    }

    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.replace("/login")
      return
    }

    // Redirect if authenticated but not an admin
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.replace("/dashboard")
      return
    }
  }, [pathname, status, session, router])

  // Show loading while checking authentication
  if (pathname !== "/admin/login" && status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  // Don't render admin panel if not authenticated or not admin
  if (pathname !== "/admin/login" && (status === 'unauthenticated' || session?.user?.role !== 'admin')) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

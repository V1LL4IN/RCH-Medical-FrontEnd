"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { DoctorHeader } from "@/components/doctor/layout/doctor-header"
import { DoctorSidebar } from "@/components/doctor/layout/doctor-sidebar"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace("/login")
      return
    }

    if (status === 'authenticated' && session?.user?.role !== 'doctor') {
      router.replace("/dashboard")
      return
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary mx-auto"></div>
          <p className="text-muted-foreground">Cargando portal médico...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated' || session?.user?.role !== 'doctor') {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DoctorHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

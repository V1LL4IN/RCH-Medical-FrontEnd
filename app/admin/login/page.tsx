"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function AdminLoginPage() {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    // Always redirect to main login page
    // The main login will handle role-based redirects
    router.replace('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Redirigiendo al inicio de sesión...</p>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log('🔐 Attempting login with:', formData.email);

    try {
      // Use redirect: false to handle errors and redirects manually
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('📊 SignIn result:', result);

      if (result?.error) {
        // Login failed
        console.log('❌ SignIn error:', result.error);
        setError("Correo o contraseña incorrectos")
        toast({
          title: "Error de autenticación",
          description: "Correo o contraseña incorrectos",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (result?.ok) {
        // Login successful - now get session to determine role
        console.log('✅ Login successful! Getting session...');

        // Get the fresh session
        const session = await getSession()

        console.log('👤 Session:', session);

        toast({
          title: "¡Bienvenido!",
          description: "Iniciando sesión...",
        })

        // Redirect based on role
        let redirectUrl = '/dashboard' // default

        if (session?.user?.role === 'admin') {
          redirectUrl = '/admin'
          console.log('🔑 Admin detected, redirecting to /admin');
        } else if (session?.user?.role === 'doctor') {
          redirectUrl = '/doctor/dashboard'
          console.log('👨‍⚕️ Doctor detected, redirecting to /doctor/dashboard');
        } else if (session?.user?.role === 'ally') {
          redirectUrl = '/aliado/validar'
          console.log('🤝 Ally detected, redirecting to /aliado/validar');
        } else {
          console.log('👤 Patient detected, redirecting to /dashboard');
        }

        console.log('🔄 Redirecting to:', redirectUrl);

        // Force page reload to the appropriate dashboard
        window.location.href = redirectUrl
      } else {
        console.log('⚠️ Unexpected result:', result);
        setError("Error inesperado al iniciar sesión")
        setIsLoading(false)
      }
    } catch (err) {
      console.error('❌ Login exception:', err);
      setError("Error al iniciar sesión")
      toast({
        title: "Error",
        description: "Error al iniciar sesión",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo-rch.png" alt="RCH Logo" width={60} height={60} className="object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Red Cedco Health</h1>
          <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-input border-border pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-foreground">Recuérdame</span>
            </label>
            <Link href="#" className="text-primary hover:text-primary/90">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-10" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>

        {/* Signup link - Fixed link to /registro */}
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-primary font-semibold hover:text-primary/90">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

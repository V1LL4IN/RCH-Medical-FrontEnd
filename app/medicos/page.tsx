import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { DoctorsPage } from "@/components/pages/doctors-page"
import { Suspense } from "react"

export default function DoctorsRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center">Cargando...</div>}>
          <DoctorsPage />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}

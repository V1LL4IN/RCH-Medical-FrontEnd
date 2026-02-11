import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { SpecialtiesPage } from "@/components/pages/specialties-page"

export default function SpecialtiesRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <SpecialtiesPage />
      </div>
      <Footer />
    </main>
  )
}

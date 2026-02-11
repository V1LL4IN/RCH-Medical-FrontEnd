import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { AllyValidationPage } from "@/components/pages/ally-validation-page"

export default function AllyValidationRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <AllyValidationPage />
      </div>
      <Footer />
    </main>
  )
}

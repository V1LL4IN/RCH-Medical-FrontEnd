import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AlliesListPage } from "@/components/pages/allies-list-page"

export default function AliadosPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <AlliesListPage />
      <Footer />
    </main>
  )
}

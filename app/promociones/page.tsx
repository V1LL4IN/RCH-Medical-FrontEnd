import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { PromotionsPage } from "@/components/pages/promotions-page"

export default function PromotionsRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <PromotionsPage />
      </div>
      <Footer />
    </main>
  )
}

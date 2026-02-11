import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ContactPage } from "@/components/pages/contact-page"

export default function ContactRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <ContactPage />
      </div>
      <Footer />
    </main>
  )
}

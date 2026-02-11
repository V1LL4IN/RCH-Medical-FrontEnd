import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DoctorDashboard } from "@/components/pages/doctor-dashboard"

export default function DoctorDashboardPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <DoctorDashboard />
      </div>
      <Footer />
    </main>
  )
}

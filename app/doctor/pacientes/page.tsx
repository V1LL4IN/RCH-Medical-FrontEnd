import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DoctorPatientsList } from "@/components/pages/doctor-patients-list"

export default function DoctorPatientsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <DoctorPatientsList />
      </div>
      <Footer />
    </main>
  )
}

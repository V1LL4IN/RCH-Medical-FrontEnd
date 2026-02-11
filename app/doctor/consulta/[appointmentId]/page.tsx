import { AuthHeader } from "@/components/layout/auth-header"
import { MedicalConsultationPage } from "@/components/pages/medical-consultation-page"

export default function ConsultaPage({ params }: { params: { appointmentId: string } }) {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <AuthHeader />
      <MedicalConsultationPage appointmentId={params.appointmentId} />
    </main>
  )
}

import { MedicalConsultationPage } from "@/components/pages/medical-consultation-page"

export default function ConsultaPage({ params }: { params: { appointmentId: string } }) {
  return <MedicalConsultationPage appointmentId={params.appointmentId} />
}

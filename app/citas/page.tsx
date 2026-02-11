import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { AppointmentsCalendar } from "@/components/pages/appointments-calendar"

export default function AppointmentsRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <AppointmentsCalendar />
      </div>
      <Footer />
    </main>
  )
}

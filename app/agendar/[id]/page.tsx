import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { BookingPage } from "@/components/pages/booking-page"

export default async function BookingRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <BookingPage doctorId={id} />
      </div>
      <Footer />
    </main>
  )
}

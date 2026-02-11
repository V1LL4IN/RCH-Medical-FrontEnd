import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { UserDashboard } from "@/components/pages/user-dashboard"

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <UserDashboard />
      </div>
      <Footer />
    </main>
  )
}

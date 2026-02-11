import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { ProfilePage } from "@/components/pages/profile-page"

export default function ProfileRoute() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <ProfilePage />
      </div>
      <Footer />
    </main>
  )
}

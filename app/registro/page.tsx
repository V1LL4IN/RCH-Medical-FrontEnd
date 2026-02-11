import { Header } from "@/components/layout/header"
import { SignupForm } from "@/components/auth/signup-form"

export default function RegistroPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <SignupForm />
      </div>
    </main>
  )
}

"use client"

import { AuthHeader } from "@/components/layout/auth-header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/components/sections/hero"
import { Services } from "@/components/sections/services"
import { Specialties } from "@/components/sections/specialties"
import { Promotion } from "@/components/sections/promotion"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <AuthHeader />
      <div className="flex-1">
        <Hero />
        <Specialties />
        <Services />
        <Promotion />
      </div>
      <Footer />
    </main>
  )
}

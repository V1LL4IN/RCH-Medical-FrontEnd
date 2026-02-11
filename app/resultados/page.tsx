import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ExamResults } from "@/components/pages/exam-results"

export default function ResultsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <ExamResults />
      </div>
      <Footer />
    </main>
  )
}

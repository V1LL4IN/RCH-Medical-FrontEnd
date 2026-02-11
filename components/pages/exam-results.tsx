"use client"

import { useState } from "react"
import { FileText, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const examResults = [
  {
    id: 1,
    type: "Examen de Sangre",
    date: "2024-12-10",
    doctor: "Dr. López",
    status: "completed",
    file: "/examen-sangre.pdf",
  },
  {
    id: 2,
    type: "Radiografía de Tórax",
    date: "2024-11-25",
    doctor: "Dr. Sánchez",
    status: "completed",
    file: "/radiografia-torax.pdf",
  },
  {
    id: 3,
    type: "EKG",
    date: "2024-10-15",
    doctor: "Dr. García",
    status: "completed",
    file: "/ekg.pdf",
  },
  {
    id: 4,
    type: "Ultrasonografía",
    date: "2024-09-30",
    doctor: "Dra. Martínez",
    status: "completed",
    file: "/ultrasonografia.pdf",
  },
]

export function ExamResults() {
  const [searchTerm, setSearchTerm] = useState("")

  const filtered = examResults.filter(
    (exam) =>
      exam.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.doctor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-balance">Resultados de Exámenes</h1>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por tipo de examen o médico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-secondary border-border"
            />
          </div>
        </div>

        {/* Results table/list */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tipo de Examen</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Médico</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exam) => (
                  <tr key={exam.id} className="border-b border-border hover:bg-secondary transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{exam.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{exam.doctor}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Completado
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-primary">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground">No se encontraron resultados</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  User,
  Calendar,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  FlaskConical,
  ImageIcon,
} from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { mockCIE10Codes } from "@/lib/mock-data"
import type { DiagnosisItem, Prescription, MedicalOrder } from "@/lib/types"

export function MedicalConsultationPage({ appointmentId }: { appointmentId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const {
    currentUser,
    appointments,
    updateAppointment,
    createMedicalRecord,
    createPrescriptionCode,
    createOrderCode,
  } = useStore()

  const appointment = appointments.find((a) => a.id === appointmentId)

  // Form state
  const [searchCIE, setSearchCIE] = useState("")
  const [showCIEDropdown, setShowCIEDropdown] = useState(false)
  const [diagnosis, setDiagnosis] = useState<DiagnosisItem[]>([])
  const [indications, setIndications] = useState("")
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [orders, setOrders] = useState<{ type: "laboratory" | "imaging"; description: string; checked: boolean }[]>([
    { type: "laboratory", description: "", checked: false },
    { type: "imaging", description: "", checked: false },
  ])

  // New prescription form
  const [newPrescription, setNewPrescription] = useState({
    medication: "",
    dose: "",
    frequency: "",
    duration: "",
    instructions: "",
  })

  // Redirect if not authorized
  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    } else if (currentUser.role !== "doctor") {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  // Filter CIE codes based on search
  const filteredCIE = useMemo(() => {
    if (!searchCIE) return mockCIE10Codes.slice(0, 10)
    return mockCIE10Codes.filter(
      (c) =>
        c.code.toLowerCase().includes(searchCIE.toLowerCase()) ||
        c.description.toLowerCase().includes(searchCIE.toLowerCase())
    )
  }, [searchCIE])

  if (!currentUser || currentUser.role !== "doctor") {
    return null
  }

  if (!appointment) {
    return (
      <section className="w-full bg-background py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cita no encontrada</h1>
          <Button onClick={() => router.push("/doctor/dashboard")}>Volver al Dashboard</Button>
        </div>
      </section>
    )
  }

  const addDiagnosis = (item: DiagnosisItem) => {
    if (!diagnosis.find((d) => d.code === item.code)) {
      setDiagnosis([...diagnosis, item])
    }
    setSearchCIE("")
    setShowCIEDropdown(false)
  }

  const removeDiagnosis = (code: string) => {
    setDiagnosis(diagnosis.filter((d) => d.code !== code))
  }

  const addPrescription = () => {
    if (newPrescription.medication && newPrescription.dose) {
      setPrescriptions([
        ...prescriptions,
        {
          id: `med-${Date.now()}`,
          ...newPrescription,
        },
      ])
      setNewPrescription({
        medication: "",
        dose: "",
        frequency: "",
        duration: "",
        instructions: "",
      })
    }
  }

  const removePrescription = (id: string) => {
    setPrescriptions(prescriptions.filter((p) => p.id !== id))
  }

  const generateCode = (prefix: string) => {
    return `${prefix}-${Date.now().toString().slice(-6)}`
  }

  const handleSave = () => {
    if (diagnosis.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un diagnóstico",
        variant: "destructive",
      })
      return
    }

    // Generate codes for orders
    const medicalOrders: MedicalOrder[] = orders
      .filter((o) => o.checked && o.description)
      .map((o) => ({
        id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: o.type,
        description: o.description,
        code: generateCode(o.type === "laboratory" ? "LAB" : "IMG"),
        used: false,
      }))

    // Create medical record
    const record = createMedicalRecord({
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientCedula: appointment.patientCedula,
      doctorId: currentUser.doctorId || "",
      doctorName: currentUser.name,
      appointmentId: appointment.id,
      date: new Date().toISOString(),
      reason: appointment.reason,
      antecedents: "",
      physicalExam: "",
      diagnosis: diagnosis,
      evolution: "",
      plan: indications,
      prescription: prescriptions,
      orders: medicalOrders,
    })

    // Create prescription code if there are prescriptions
    if (prescriptions.length > 0) {
      const rxCode = generateCode("RX")
      createPrescriptionCode({
        code: rxCode,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientCedula: appointment.patientCedula,
        doctorId: currentUser.doctorId || "",
        doctorName: currentUser.name,
        items: prescriptions,
        createdAt: new Date().toISOString(),
        used: false,
      })
    }

    // Create order codes
    medicalOrders.forEach((order) => {
      createOrderCode({
        code: order.code,
        type: order.type as "laboratory" | "imaging",
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientCedula: appointment.patientCedula,
        doctorId: currentUser.doctorId || "",
        doctorName: currentUser.name,
        description: order.description,
        createdAt: new Date().toISOString(),
        used: false,
      })
    })

    // Update appointment status to completed
    updateAppointment(appointment.id, { status: "completed" })

    toast({
      title: "Consulta guardada",
      description: "La historia clínica ha sido registrada y los códigos generados exitosamente.",
    })

    router.push("/doctor/dashboard")
  }

  return (
    <section className="w-full bg-background py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="bg-transparent">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Historia Clínica</h1>
            <p className="text-muted-foreground">Consulta médica - {appointment.specialty}</p>
          </div>
        </div>

        {/* Patient info card */}
        <div className="bg-secondary rounded-xl p-6 mb-8 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{appointment.patientName}</h3>
              <p className="text-sm text-muted-foreground">C.I.: {appointment.patientCedula}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(appointment.date).toLocaleDateString("es-ES")} - {appointment.time}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Motivo: {appointment.reason || "No especificado"}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Diagnosis CIE-10 */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Diagnóstico (CIE-10)
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar código CIE-10..."
                value={searchCIE}
                onChange={(e) => {
                  setSearchCIE(e.target.value)
                  setShowCIEDropdown(true)
                }}
                onFocus={() => setShowCIEDropdown(true)}
                className="pl-10 bg-input"
              />
              {showCIEDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCIE.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => addDiagnosis(item)}
                      className="w-full px-4 py-2 text-left hover:bg-secondary transition-colors flex items-center gap-2"
                    >
                      <Badge variant="outline" className="shrink-0">
                        {item.code}
                      </Badge>
                      <span className="text-sm text-foreground truncate">{item.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected diagnoses */}
            {diagnosis.length > 0 && (
              <div className="space-y-2">
                {diagnosis.map((d) => (
                  <div key={d.code} className="flex items-center justify-between bg-secondary rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20">{d.code}</Badge>
                      <span className="text-sm text-foreground">{d.description}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeDiagnosis(d.code)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Indications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Indicaciones</h3>
            <textarea
              value={indications}
              onChange={(e) => setIndications(e.target.value)}
              placeholder="Indicaciones para el paciente..."
              className="w-full h-32 px-4 py-3 border border-border rounded-lg bg-input text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Prescriptions */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Receta Médica
            </h3>

            {/* Existing prescriptions */}
            {prescriptions.length > 0 && (
              <div className="space-y-2 mb-4">
                {prescriptions.map((p) => (
                  <div key={p.id} className="flex items-start justify-between bg-secondary rounded-lg p-3">
                    <div>
                      <p className="font-semibold text-foreground">{p.medication}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.dose} - {p.frequency} - {p.duration}
                      </p>
                      {p.instructions && <p className="text-xs text-muted-foreground mt-1">{p.instructions}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removePrescription(p.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add new prescription */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Input
                placeholder="Medicamento"
                value={newPrescription.medication}
                onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                className="bg-input"
              />
              <Input
                placeholder="Dosis (ej: 500mg)"
                value={newPrescription.dose}
                onChange={(e) => setNewPrescription({ ...newPrescription, dose: e.target.value })}
                className="bg-input"
              />
              <Input
                placeholder="Frecuencia (ej: cada 8 horas)"
                value={newPrescription.frequency}
                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                className="bg-input"
              />
              <Input
                placeholder="Duración (ej: 7 días)"
                value={newPrescription.duration}
                onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                className="bg-input"
              />
            </div>
            <Input
              placeholder="Instrucciones adicionales (opcional)"
              value={newPrescription.instructions}
              onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
              className="bg-input mb-3"
            />
            <Button variant="outline" onClick={addPrescription} className="bg-transparent gap-2">
              <Plus className="w-4 h-4" />
              Agregar medicamento
            </Button>
          </div>

          {/* Medical Orders */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Órdenes Médicas</h3>

            <div className="space-y-4">
              {/* Laboratory */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={orders[0].checked}
                  onChange={(e) => {
                    const newOrders = [...orders]
                    newOrders[0].checked = e.target.checked
                    setOrders(newOrders)
                  }}
                  className="w-5 h-5 mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">Laboratorio Clínico</span>
                  </div>
                  {orders[0].checked && (
                    <Input
                      placeholder="Exámenes requeridos (ej: Hemograma, Glucosa, Perfil lipídico)"
                      value={orders[0].description}
                      onChange={(e) => {
                        const newOrders = [...orders]
                        newOrders[0].description = e.target.value
                        setOrders(newOrders)
                      }}
                      className="bg-input"
                    />
                  )}
                </div>
              </div>

              {/* Imaging */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={orders[1].checked}
                  onChange={(e) => {
                    const newOrders = [...orders]
                    newOrders[1].checked = e.target.checked
                    setOrders(newOrders)
                  }}
                  className="w-5 h-5 mt-1 accent-primary"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ImageIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">Rayos X / Imagen</span>
                  </div>
                  {orders[1].checked && (
                    <Input
                      placeholder="Tipo de imagen requerida (ej: Radiografía de tórax, Ecografía abdominal)"
                      value={orders[1].description}
                      onChange={(e) => {
                        const newOrders = [...orders]
                        newOrders[1].description = e.target.value
                        setOrders(newOrders)
                      }}
                      className="bg-input"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.back()} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-accent hover:bg-accent/90 gap-2">
              <CheckCircle className="w-4 h-4" />
              Guardar y Finalizar Consulta
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

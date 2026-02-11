"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle2, XCircle, FileText, FlaskConical, Plus, AlertCircle, Upload, ImageIcon } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import type { PrescriptionCode, OrderCode } from "@/lib/types"

export function AllyValidationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    currentUser,
    allies,
    prescriptionCodes,
    orderCodes,
    usePrescriptionCode,
    useOrderCode,
    createPrescriptionCode,
    createOrderCode,
    addLabResult,
  } = useStore()

  const [searchCode, setSearchCode] = useState("")
  const [searchResult, setSearchResult] = useState<{
    type: "prescription" | "order" | null
    data: PrescriptionCode | OrderCode | null
    notFound: boolean
  }>({ type: null, data: null, notFound: false })

  const usePrescriptionCodeHook = usePrescriptionCode
  const useOrderCodeHook = useOrderCode

  // Get ally info
  const ally = currentUser?.allyId ? allies.find(a => a.id === currentUser.allyId) : null
  const isLabOrImaging = ally?.type === "laboratory" || ally?.type === "imaging"

  // Redirect if not an ally
  useEffect(() => {
    if (!currentUser) {
      router.push("/login")
    } else if (currentUser.role !== "ally") {
      router.push("/dashboard")
    }
  }, [currentUser, router])

  const handleSearch = () => {
    if (!searchCode.trim()) return

    // Search in prescription codes
    const prescription = prescriptionCodes.find((p) => p.code === searchCode.trim().toUpperCase())
    if (prescription) {
      setSearchResult({ type: "prescription", data: prescription, notFound: false })
      return
    }

    // Search in order codes
    const order = orderCodes.find((o) => o.code === searchCode.trim().toUpperCase())
    if (order) {
      setSearchResult({ type: "order", data: order, notFound: false })
      return
    }

    // Not found
    setSearchResult({ type: null, data: null, notFound: true })
  }

  const handleMarkAsUsed = (code: string, type: "prescription" | "order") => {
    if (type === "prescription") {
      usePrescriptionCodeHook(code)
      toast({
        title: "Receta validada",
        description: `La receta ${code} ha sido marcada como utilizada.`,
      })
    } else if (type === "order") {
      useOrderCodeHook(code)
      toast({
        title: "Orden validada",
        description: `La orden ${code} ha sido marcada como utilizada.`,
      })
    }

    // Refresh search result
    setSearchResult({ type: null, data: null, notFound: false })
    setSearchCode("")
  }

  const handleUploadResult = (orderData: OrderCode) => {
    if (!ally || !currentUser) return

    // Simulate file upload
    const fileName = `resultado-${orderData.code}-${Date.now()}.pdf`

    addLabResult({
      id: `result-${Date.now()}`,
      orderId: orderData.code,
      patientId: orderData.patientId,
      allyId: ally.id,
      allyName: ally.name,
      type: orderData.type as "laboratory" | "imaging",
      fileName: fileName,
      uploadedAt: new Date().toISOString(),
      description: orderData.description,
    })

    // Mark order as used
    // useOrderCodeHook(orderData.code)

    toast({
      title: "Resultado subido exitosamente",
      description: `El resultado ha sido cargado y está disponible para el paciente.`,
    })

    // Refresh search result
    setSearchResult({ type: null, data: null, notFound: false })
    setSearchCode("")
  }

  // Generate demo codes for testing
  const handleGenerateDemoCodes = () => {
    const rxCode = `RX-${Date.now().toString().slice(-6)}`
    const labCode = `LAB-${Date.now().toString().slice(-6)}`

    createPrescriptionCode({
      code: rxCode,
      patientId: "user-patient-1",
      patientName: "Juan Pérez",
      patientCedula: "1712345678",
      doctorId: "doc-1",
      doctorName: "Dra. Saskia Rueda",
      items: [
        {
          id: "med-1",
          medication: "Ibuprofeno 400mg",
          dose: "1 tableta",
          frequency: "Cada 8 horas",
          duration: "5 días",
          instructions: "Tomar después de las comidas",
        },
        {
          id: "med-2",
          medication: "Omeprazol 20mg",
          dose: "1 cápsula",
          frequency: "Cada 24 horas",
          duration: "10 días",
          instructions: "Tomar en ayunas",
        },
      ],
      createdAt: new Date().toISOString(),
      used: false,
    })

    createOrderCode({
      code: labCode,
      type: "laboratory",
      patientId: "user-patient-1",
      patientName: "Juan Pérez",
      patientCedula: "1712345678",
      doctorId: "doc-1",
      doctorName: "Dra. Saskia Rueda",
      description: "Hemograma completo, Glucosa en ayunas, Perfil lipídico",
      createdAt: new Date().toISOString(),
      used: false,
    })

    toast({
      title: "Códigos generados",
      description: (
        <div className="mt-2">
          <p>
            Receta: <strong>{rxCode}</strong>
          </p>
          <p>
            Laboratorio: <strong>{labCode}</strong>
          </p>
        </div>
      ),
    })
  }

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Portal de Aliado</h1>
          <p className="text-lg text-muted-foreground">Valida códigos de recetas y órdenes médicas de pacientes RCH</p>
        </div>

        {/* Search box */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Validar Código</h2>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ingresa el código (ej: RX-123456, LAB-789012)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-12 bg-input border-border uppercase"
              />
            </div>
            <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
              Buscar
            </Button>
          </div>

          {/* Demo button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleGenerateDemoCodes} className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Generar códigos de demostración
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Genera códigos de prueba para demostrar la funcionalidad
            </p>
          </div>
        </div>

        {/* Search result */}
        {searchResult.notFound && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">Código no encontrado</h3>
            <p className="text-muted-foreground">
              El código <strong>{searchCode}</strong> no existe en el sistema o es inválido.
            </p>
          </div>
        )}

        {searchResult.data && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Header */}
            <div className={`p-6 ${searchResult.data.used ? "bg-muted" : "bg-primary/10"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {searchResult.type === "prescription" ? (
                    <FileText className="w-8 h-8 text-primary" />
                  ) : (
                    <FlaskConical className="w-8 h-8 text-primary" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {searchResult.type === "prescription" ? "Receta Médica" : "Orden de Laboratorio/Imagen"}
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">{searchResult.data.code}</h3>
                  </div>
                </div>
                {searchResult.data.used ? (
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-sm py-1 px-3">
                    <XCircle className="w-4 h-4 mr-1" />
                    Ya utilizado
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-sm py-1 px-3">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Válido
                  </Badge>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Paciente</p>
                  <p className="font-semibold text-foreground">{searchResult.data.patientName}</p>
                  <p className="text-xs text-muted-foreground">C.I.: {searchResult.data.patientCedula}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Médico</p>
                  <p className="font-semibold text-foreground">{searchResult.data.doctorName}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Fecha de emisión</p>
                <p className="font-semibold text-foreground">
                  {new Date(searchResult.data.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              {/* Prescription items */}
              {searchResult.type === "prescription" && (searchResult.data as PrescriptionCode).items && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Medicamentos</p>
                  <div className="space-y-2">
                    {(searchResult.data as PrescriptionCode).items.map((item, idx) => (
                      <div key={idx} className="bg-secondary rounded-lg p-3">
                        <p className="font-semibold text-foreground">{item.medication}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.dose} - {item.frequency} - {item.duration}
                        </p>
                        {item.instructions && <p className="text-xs text-muted-foreground mt-1">{item.instructions}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order description */}
              {searchResult.type === "order" && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descripción de la orden</p>
                  <div className="bg-secondary rounded-lg p-3">
                    <Badge variant="outline" className="mb-2">
                      {(searchResult.data as OrderCode).type === "laboratory" && "Laboratorio"}
                      {(searchResult.data as OrderCode).type === "imaging" && "Imágenes"}
                      {(searchResult.data as OrderCode).type === "physiotherapy" && "Fisioterapia"}
                    </Badge>
                    <p className="text-foreground">{(searchResult.data as OrderCode).description}</p>
                  </div>
                </div>
              )}

              {searchResult.data.used && searchResult.data.usedAt && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Utilizado el</p>
                  <p className="font-semibold text-foreground">
                    {new Date(searchResult.data.usedAt).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Action */}
            {!searchResult.data.used && (
              <div className="p-6 border-t border-border space-y-4">
                {/* Upload result section for lab/imaging allies */}
                {searchResult.type === "order" && 
                  isLabOrImaging && 
                  ((searchResult.data as OrderCode).type === "laboratory" || (searchResult.data as OrderCode).type === "imaging") && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Upload className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground">Subir resultado del examen</h4>
                        <p className="text-sm text-muted-foreground">
                          Carga el archivo PDF con los resultados para que el paciente pueda acceder desde su portal.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => handleUploadResult(searchResult.data as OrderCode)}
                        className="flex-1 bg-accent hover:bg-accent/90 gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Subir Resultado (Simulado)
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3">
                      Al subir el resultado, la orden se marcara automaticamente como utilizada y el paciente recibira una notificacion.
                    </p>
                  </div>
                )}
                
                {/* Standard mark as used button */}
                <Button
                  onClick={() => handleMarkAsUsed(searchResult.data!.code, searchResult.type!)}
                  variant={searchResult.type === "order" && isLabOrImaging ? "outline" : "default"}
                  className={searchResult.type === "order" && isLabOrImaging 
                    ? "w-full bg-transparent border-border" 
                    : "w-full bg-primary hover:bg-primary/90"
                  }
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {searchResult.type === "order" && isLabOrImaging 
                    ? "Solo marcar como utilizado (sin subir resultado)" 
                    : "Marcar como utilizado"
                  }
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Info box */}
        {!searchResult.data && !searchResult.notFound && (
          <div className="bg-muted/50 border border-border rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Ingresa un código para validar</h3>
            <p className="text-sm text-muted-foreground">
              Los códigos de receta comienzan con <strong>RX-</strong> y los de laboratorio/imagen con{" "}
              <strong>LAB-</strong> o <strong>IMG-</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

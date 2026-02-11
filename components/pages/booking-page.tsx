"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, User, Video, Building, Home, AlertCircle, Gift, CreditCard, Building2, Upload } from "lucide-react"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import type { Sector, ModalityType } from "@/lib/types"
import { Badge } from "@/components/ui/badge"

export function BookingPage({ doctorId }: { doctorId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { doctors, currentUser, createAppointment, updateUser, paymentSettings } = useStore()

  const doctor = doctors.find((d) => d.id === doctorId)

  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedSector, setSelectedSector] = useState<Sector | "">("")
  const [selectedModality, setSelectedModality] = useState<ModalityType | "">("")
  const [wantsMembership, setWantsMembership] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer">("card")
  const [transferProof, setTransferProof] = useState<string | null>(null)
  const [patientInfo, setPatientInfo] = useState({
    fullName: currentUser?.name || "",
    cedula: currentUser?.cedula || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    symptoms: "",
  })

  const price = 100; // Example price, replace with actual calculation

  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agendar una cita",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [currentUser, router, toast])

  useEffect(() => {
    if (currentUser) {
      setPatientInfo({
        fullName: currentUser.name || "",
        cedula: currentUser.cedula || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        symptoms: "",
      })
    }
  }, [currentUser])

  if (!doctor) {
    return (
      <section className="w-full bg-background py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Médico no encontrado</h1>
          <p className="text-muted-foreground mb-6">El médico que buscas no existe o ya no está disponible.</p>
          <Button onClick={() => router.push("/medicos")} className="bg-primary hover:bg-primary/90">
            Ver todos los médicos
          </Button>
        </div>
      </section>
    )
  }

  if (!currentUser) {
    return null
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const getAvailableSlots = () => {
    if (!selectedDate || !selectedSector) return []
    const date = new Date(selectedDate)
    const dayOfWeek = date.getDay()
    const scheduleForDay = doctor.schedule.find((s) => s.day === dayOfWeek && s.sector === selectedSector)
    return scheduleForDay?.slots || []
  }

  const timeSlots = getAvailableSlots()

  const isMember = currentUser.membershipActive || false
  const membershipPrice = 15 // Monthly membership price
  
  // Calculate prices based on membership status and upsell
  const willHaveMembership = isMember || wantsMembership
  const consultationPrice = willHaveMembership ? doctor.priceMember : doctor.priceNormal
  const totalPrice = wantsMembership && !isMember 
    ? consultationPrice + membershipPrice 
    : consultationPrice
  const savings = doctor.priceNormal - doctor.priceMember

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime && selectedSector && selectedModality) setStep(2)
    if (step === 2 && patientInfo.fullName && patientInfo.cedula && patientInfo.email && patientInfo.phone) setStep(3)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleConfirm = () => {
    if (!currentUser || !selectedSector || !selectedModality) return

    // If user opted for membership, activate it
    if (wantsMembership && !isMember) {
      updateUser(currentUser.id, {
        membershipActive: true,
        membershipExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })
    }

    // Determine appointment status based on payment method
    const appointmentStatus = paymentMethod === "transfer" ? "pending_verification" : "paid"

    const appointment = createAppointment({
      patientId: currentUser.id,
      patientName: patientInfo.fullName,
      patientCedula: patientInfo.cedula,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: selectedDate,
      time: selectedTime,
      sector: selectedSector as Sector,
      modality: selectedModality as ModalityType,
      reason: patientInfo.symptoms,
      status: appointmentStatus,
      price: consultationPrice,
      isMember: willHaveMembership,
    })

    if (paymentMethod === "transfer") {
      toast({
        title: "Cita registrada",
        description: "Tu cita quedará confirmada una vez verifiquemos el comprobante de transferencia.",
      })
    } else {
      toast({
        title: "Cita agendada exitosamente",
        description: `Tu cita con ${doctor.name} ha sido confirmada para el ${new Date(selectedDate).toLocaleDateString("es-ES")} a las ${selectedTime}`,
      })
    }

    router.push("/citas")
  }

  const canProceed =
    (step === 1 && selectedDate && selectedTime && selectedSector && selectedModality) ||
    (step === 2 && patientInfo.fullName && patientInfo.cedula && patientInfo.email && patientInfo.phone)

  const getSectorLabel = (sector: string) => {
    switch (sector) {
      case "norte":
        return "Sector Norte"
      case "centro":
        return "Sector Centro"
      case "sur":
        return "Sector Sur"
      default:
        return sector
    }
  }

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case "presencial":
        return <Building className="w-4 h-4" />
      case "telemedicina":
        return <Video className="w-4 h-4" />
      case "domicilio":
        return <Home className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Agendar Cita Médica</h1>
          <p className="text-lg text-muted-foreground">Completa los pasos para reservar tu cita</p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                  s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground text-center">
                {s === 1 && "Fecha y Hora"}
                {s === 2 && "Tu Información"}
                {s === 3 && "Confirmación"}
              </p>
              {s < 3 && <div className={`flex-1 h-1 mt-4 ${s < step ? "bg-primary" : "bg-border"}`}></div>}
            </div>
          ))}
        </div>

        {/* Doctor info card */}
        <div className="bg-secondary rounded-xl p-6 mb-8 border border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <img
              src={doctor.photo || "/placeholder.svg"}
              alt={doctor.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              <div className="flex items-center gap-2 mt-2">
                {doctor.modalities.map((mod) => (
                  <Badge key={mod} variant="outline" className="text-xs">
                    {mod === "presencial" && "Presencial"}
                    {mod === "telemedicina" && "Telemedicina"}
                    {mod === "domicilio" && "A Domicilio"}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              {!isMember && <p className="text-sm text-muted-foreground line-through">${doctor.priceNormal}</p>}
              <p className="text-2xl font-bold text-primary">${price}</p>
              <p className="text-xs text-muted-foreground">{isMember ? "precio miembro" : "por consulta"}</p>
              {isMember && (
                <Badge className="mt-1 bg-accent/10 text-accent border-accent/20">
                  Ahorro: ${doctor.priceNormal - doctor.priceMember}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          {/* Step 1: Date, Sector, Modality and Time */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Sector selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">Selecciona un sector</label>
                <div className="grid grid-cols-3 gap-3">
                  {doctor.sectors.map((sector) => (
                    <button
                      key={sector}
                      onClick={() => {
                        setSelectedSector(sector)
                        setSelectedTime("") // Reset time when sector changes
                      }}
                      className={`py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                        selectedSector === sector
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {getSectorLabel(sector)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modality selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">Modalidad de atención</label>
                <div className="grid grid-cols-3 gap-3">
                  {doctor.modalities.map((modality) => (
                    <button
                      key={modality}
                      onClick={() => setSelectedModality(modality)}
                      className={`py-3 px-4 rounded-lg border-2 transition-all font-medium text-sm flex items-center justify-center gap-2 ${
                        selectedModality === modality
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary"
                      }`}
                    >
                      {getModalityIcon(modality)}
                      {modality === "presencial" && "Presencial"}
                      {modality === "telemedicina" && "Telemedicina"}
                      {modality === "domicilio" && "A Domicilio"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-4">Selecciona una fecha</label>
                <input
                  type="date"
                  min={getTodayDate()}
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                    setSelectedTime("") // Reset time when date changes
                  }}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Time slots */}
              {selectedDate && selectedSector && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-4">Horarios disponibles</label>
                  {timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-2 px-4 rounded-lg border-2 transition-all font-medium text-sm ${
                            selectedTime === time
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-primary"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        No hay horarios disponibles para esta fecha y sector. Por favor, selecciona otra fecha.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {selectedDate && selectedTime && selectedSector && selectedModality && (
                <div className="bg-primary/10 rounded-lg p-4 flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">
                      Cita: {new Date(selectedDate).toLocaleDateString("es-ES")} a las {selectedTime}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getSectorLabel(selectedSector)} - {selectedModality === "presencial" && "Presencial"}
                      {selectedModality === "telemedicina" && "Telemedicina"}
                      {selectedModality === "domicilio" && "A Domicilio"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Patient Info */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nombre Completo</label>
                <Input
                  type="text"
                  placeholder="Tu nombre completo"
                  value={patientInfo.fullName}
                  onChange={(e) => setPatientInfo({ ...patientInfo, fullName: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Cédula de Identidad</label>
                <Input
                  type="text"
                  placeholder="1712345678"
                  value={patientInfo.cedula}
                  onChange={(e) => setPatientInfo({ ...patientInfo, cedula: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Correo Electrónico</label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Teléfono</label>
                <Input
                  type="tel"
                  placeholder="0987654321"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Motivo de Consulta (opcional)
                </label>
                <textarea
                  placeholder="Describe brevemente el motivo de tu consulta..."
                  value={patientInfo.symptoms}
                  onChange={(e) => setPatientInfo({ ...patientInfo, symptoms: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Resumen de tu cita</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha y Hora</p>
                    <p className="font-semibold text-foreground">
                      {new Date(selectedDate).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      a las {selectedTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paciente</p>
                    <p className="font-semibold text-foreground">{patientInfo.fullName}</p>
                    <p className="text-xs text-muted-foreground">C.I.: {patientInfo.cedula}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Especialista y Ubicación</p>
                    <p className="font-semibold text-foreground">{doctor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getSectorLabel(selectedSector as string)} - {selectedModality === "presencial" && "Presencial"}
                      {selectedModality === "telemedicina" && "Telemedicina"}
                      {selectedModality === "domicilio" && "A Domicilio"}
                    </p>
                    {/* Show address only after confirming payment - this is the final step */}
                    {selectedModality === "presencial" && doctor.addresses && selectedSector && doctor.addresses[selectedSector as Sector] && (
                      <p className="text-sm text-foreground mt-1 font-medium">
                        Dirección: {doctor.addresses[selectedSector as Sector]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Membership Upsell - Only show if user is NOT a member */}
                {!isMember && (
                  <div className="bg-gradient-to-r from-accent/10 to-accent/5 border-2 border-accent/30 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                      <Gift className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-1">¡Ahorra en esta consulta!</h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          Activa tu membresía por <span className="font-bold text-accent">${membershipPrice}/mes</span> y paga solo{" "}
                          <span className="font-bold text-accent">${doctor.priceMember}</span> en lugar de{" "}
                          <span className="line-through">${doctor.priceNormal}</span>
                        </p>
                        <label className="flex items-center gap-3 cursor-pointer bg-background rounded-lg p-3 border border-border hover:border-accent transition-colors">
                          <input
                            type="checkbox"
                            checked={wantsMembership}
                            onChange={(e) => setWantsMembership(e.target.checked)}
                            className="w-5 h-5 rounded accent-accent"
                          />
                          <span className="text-sm font-medium text-foreground">
                            Quiero activar mi membresía ahora (+${membershipPrice})
                          </span>
                          {wantsMembership && (
                            <Badge className="bg-accent/20 text-accent border-accent/30 ml-auto">
                              Ahorro: ${savings}
                            </Badge>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Method Selection */}
                <div className="border border-border rounded-xl p-5">
                  <h4 className="font-bold text-foreground mb-4">Método de pago</h4>
                  <div className="space-y-3">
                    {paymentSettings.paymentMethods.card && (
                      <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="w-4 h-4 accent-primary"
                        />
                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Tarjeta de crédito/débito</span>
                      </label>
                    )}
                    {paymentSettings.paymentMethods.transfer && (
                      <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-all ${
                        paymentMethod === "transfer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "transfer"}
                          onChange={() => setPaymentMethod("transfer")}
                          className="w-4 h-4 accent-primary"
                        />
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Transferencia bancaria</span>
                      </label>
                    )}
                  </div>

                  {/* Bank transfer details */}
                  {paymentMethod === "transfer" && (
                    <div className="mt-4 bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Banco</p>
                          <p className="font-medium text-foreground">{paymentSettings.bankInfo.bankName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Cuenta</p>
                          <p className="font-medium text-foreground">{paymentSettings.bankInfo.accountNumber}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tipo</p>
                          <p className="font-medium text-foreground">{paymentSettings.bankInfo.accountType}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Nombre</p>
                          <p className="font-medium text-foreground">{paymentSettings.bankInfo.ownerName}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">RUC</p>
                          <p className="font-medium text-foreground">{paymentSettings.bankInfo.ownerId}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Sube tu comprobante (opcional)
                        </label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="bg-transparent gap-2" onClick={() => {
                            // Simulate file upload
                            setTransferProof("comprobante-" + Date.now() + ".pdf")
                            toast({ title: "Comprobante cargado", description: "Se ha adjuntado el comprobante" })
                          }}>
                            <Upload className="w-4 h-4" />
                            Seleccionar archivo
                          </Button>
                          {transferProof && (
                            <span className="text-xs text-muted-foreground">{transferProof}</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-yellow-800">
                          Tu cita quedará en estado "Pendiente de verificación" hasta que confirmemos el pago.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-primary/10 rounded-lg p-4 space-y-2">
                  {wantsMembership && !isMember && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Consulta médica (precio miembro)</span>
                        <span className="text-foreground">${doctor.priceMember}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Membresía mensual</span>
                        <span className="text-foreground">${membershipPrice}</span>
                      </div>
                      <div className="flex justify-between text-sm text-accent">
                        <span>Tu ahorro en esta consulta</span>
                        <span>-${savings}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2"></div>
                    </>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Total a pagar</p>
                      {willHaveMembership && <p className="text-xs text-accent">Descuento de miembro aplicado</p>}
                    </div>
                    <p className="text-2xl font-bold text-primary">${totalPrice}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Recibirás una confirmación por correo y podrás acceder a tu cita desde tu panel de control.
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious} className="flex-1 bg-transparent">
              Atrás
            </Button>
          )}
          {step < 3 ? (
            <Button onClick={handleNext} disabled={!canProceed} className="flex-1 bg-primary hover:bg-primary/90">
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleConfirm} className="flex-1 bg-primary hover:bg-primary/90">
              Confirmar y Pagar
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}

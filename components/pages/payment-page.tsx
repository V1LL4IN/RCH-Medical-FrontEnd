"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock, Calendar } from "lucide-react"

export function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  const appointmentDetails = {
    doctor: "Dr. Carlos García",
    specialty: "Cardiología",
    date: "15 Enero 2025",
    time: "2:30 PM",
    location: "Centro Principal",
    price: 80,
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Processing payment:", formData)
  }

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-12 text-balance">Pagar Cita Médica</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Información de Pago</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment method selection */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">Método de Pago</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "card", label: "Tarjeta de Crédito", icon: "💳" },
                      { value: "transfer", label: "Transferencia", icon: "🏦" },
                      { value: "wallet", label: "Billetera Digital", icon: "📱" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all text-center ${
                          paymentMethod === method.value
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background hover:border-primary"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={paymentMethod === method.value}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="hidden"
                        />
                        <span className="text-2xl block mb-1">{method.icon}</span>
                        <span className="text-xs font-semibold text-foreground">{method.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Card details */}
                {paymentMethod === "card" && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Nombre en la Tarjeta</label>
                      <Input
                        type="text"
                        placeholder="Juan Pérez García"
                        value={formData.cardName}
                        onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Número de Tarjeta</label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardNumber: e.target.value
                              .replace(/\s/g, "")
                              .replace(/(\d{4})/g, "$1 ")
                              .trim(),
                          })
                        }
                        maxLength={19}
                        className="bg-input border-border"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Vence (MM/AA)</label>
                        <Input
                          type="text"
                          placeholder="12/25"
                          value={formData.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "")
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + "/" + value.slice(2, 4)
                            }
                            setFormData({ ...formData, expiry: value })
                          }}
                          maxLength={5}
                          className="bg-input border-border"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">CVC</label>
                        <Input
                          type="text"
                          placeholder="123"
                          value={formData.cvc}
                          onChange={(e) => setFormData({ ...formData, cvc: e.target.value.replace(/\D/g, "") })}
                          maxLength={3}
                          className="bg-input border-border"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Security notice */}
                <div className="bg-secondary rounded-lg p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Tu información de pago está protegida con encriptación SSL de 256 bits
                  </p>
                </div>

                <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-base">
                  Procesar Pago: ${appointmentDetails.price}
                </Button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-xl p-6 sticky top-4">
              <h3 className="text-xl font-bold text-foreground mb-6">Resumen de tu Cita</h3>

              <div className="space-y-4 pb-6 border-b border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">ESPECIALISTA</p>
                  <p className="font-semibold text-foreground">{appointmentDetails.doctor}</p>
                  <p className="text-xs text-primary">{appointmentDetails.specialty}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">FECHA Y HORA</p>
                  <p className="font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {appointmentDetails.date} a las {appointmentDetails.time}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">UBICACIÓN</p>
                  <p className="font-semibold text-foreground text-sm">{appointmentDetails.location}</p>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Consulta</p>
                  <p className="font-semibold text-foreground">${appointmentDetails.price}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Impuestos</p>
                  <p className="font-semibold text-foreground">${Math.round(appointmentDetails.price * 0.19)}</p>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <p className="font-semibold text-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    ${appointmentDetails.price + Math.round(appointmentDetails.price * 0.19)}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-3 bg-green-100/50 rounded-lg border border-green-200 text-xs text-green-800">
                Recibirás una confirmación por correo una vez completado el pago.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

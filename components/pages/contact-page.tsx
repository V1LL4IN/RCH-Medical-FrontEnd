"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactPage() {
  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Contáctanos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Estamos disponibles 24/7 para responder tus preguntas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: Phone,
              title: "Teléfono",
              value: "+1 (555) 123-4567",
              description: "Disponible 24/7",
            },
            {
              icon: Mail,
              title: "Email",
              value: "info@rch.com",
              description: "Respuesta en 24 horas",
            },
            {
              icon: MapPin,
              title: "Ubicación",
              value: "Calle Principal 123",
              description: "Centro Principal",
            },
          ].map((contact) => {
            const Icon = contact.icon
            return (
              <div key={contact.title} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{contact.title}</h3>
                <p className="font-semibold text-primary mb-1">{contact.value}</p>
                <p className="text-sm text-muted-foreground">{contact.description}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact form */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Envíanos un Mensaje</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nombre</label>
                <Input placeholder="Tu nombre" className="bg-input border-border" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <Input type="email" placeholder="tu@email.com" className="bg-input border-border" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Asunto</label>
                <Input placeholder="Asunto de tu mensaje" className="bg-input border-border" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Mensaje</label>
                <textarea
                  placeholder="Tu mensaje..."
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                ></textarea>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">Enviar Mensaje</Button>
            </form>
          </div>

          {/* Office hours */}
          <div className="space-y-6">
            <div className="bg-secondary rounded-xl p-8">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Horarios de Atención
              </h3>
              <div className="space-y-3">
                {[
                  { day: "Lunes - Viernes", hours: "8:00 AM - 8:00 PM" },
                  { day: "Sábado", hours: "9:00 AM - 5:00 PM" },
                  { day: "Domingo", hours: "10:00 AM - 3:00 PM" },
                  { day: "Emergencias", hours: "24 horas" },
                ].map((schedule) => (
                  <div
                    key={schedule.day}
                    className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                  >
                    <span className="font-semibold text-foreground">{schedule.day}</span>
                    <span className="text-primary font-semibold">{schedule.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 rounded-xl p-8 border border-primary/20">
              <h3 className="text-xl font-bold text-foreground mb-3">Emergencias Médicas</h3>
              <p className="text-muted-foreground mb-4">
                Para casos de emergencia, contáctanos inmediatamente o dirígete a la sala de emergencias más cercana.
              </p>
              <div className="flex items-center gap-3 p-4 bg-primary rounded-lg">
                <Phone className="w-5 h-5 text-primary-foreground" />
                <span className="text-lg font-bold text-primary-foreground">911 - EMERGENCIAS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  User,
  Appointment,
  Doctor,
  Ally,
  Membership,
  Promotion,
  MedicalRecord,
  PrescriptionCode,
  OrderCode,
  PaymentSettings,
  LabResult,
} from "./types"
import { mockDoctors, mockAllies, mockMemberships, mockPromotions, mockInitialUsers, mockPaymentSettings } from "./mock-data"

interface AppState {
  // Data
  doctors: Doctor[]
  allies: Ally[]
  memberships: Membership[]
  promotions: Promotion[]
  appointments: Appointment[]
  medicalRecords: MedicalRecord[]
  prescriptionCodes: PrescriptionCode[]
  orderCodes: OrderCode[]
  paymentSettings: PaymentSettings
  labResults: LabResult[]

  // User actions (for profile updates via API)
  updateUser: (userId: string, updates: Partial<User>) => void

  // Appointments
  createAppointment: (appointment: Omit<Appointment, "id" | "createdAt">) => Appointment
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void

  // Medical Records
  createMedicalRecord: (record: Omit<MedicalRecord, "id">) => MedicalRecord
  updateMedicalRecord: (id: string, updates: Partial<MedicalRecord>) => void

  // Codes
  createPrescriptionCode: (code: PrescriptionCode) => void
  createOrderCode: (code: OrderCode) => void
  usePrescriptionCode: (code: string) => void
  useOrderCode: (code: string) => void

  // Payment Settings
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void

  // Lab Results
  addLabResult: (result: LabResult) => void

  // Admin
  addDoctor: (doctor: Doctor) => void
  updateDoctor: (id: string, updates: Partial<Doctor>) => void
  deleteDoctor: (id: string) => void
  addAlly: (ally: Ally) => void
  updateAlly: (id: string, updates: Partial<Ally>) => void
  deleteAlly: (id: string) => void
  addMembership: (membership: Membership) => void
  updateMembership: (id: string, updates: Partial<Membership>) => void
  deleteMembership: (id: string) => void
  addPromotion: (promotion: Promotion) => void
  updatePromotion: (id: string, updates: Partial<Promotion>) => void
  deletePromotion: (id: string) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      doctors: mockDoctors,
      allies: mockAllies,
      memberships: mockMemberships,
      promotions: mockPromotions,
      appointments: [],
      medicalRecords: [],
      prescriptionCodes: [],
      orderCodes: [],
      paymentSettings: mockPaymentSettings,
      labResults: [],

      // User actions (for API calls)
      updateUser: (userId, updates) => {
        // This would typically call an API endpoint
        // For now, keeping the local state update
        // TODO: Replace with API call to /api/user/update
      },

      // Appointment actions
      createAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt-${Date.now()}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }))
        return newAppointment
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }))
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
        }))
      },

      // Medical Record actions
      createMedicalRecord: (recordData) => {
        const newRecord: MedicalRecord = {
          ...recordData,
          id: `record-${Date.now()}`,
        }
        set((state) => ({
          medicalRecords: [...state.medicalRecords, newRecord],
        }))
        return newRecord
      },

      updateMedicalRecord: (id, updates) => {
        set((state) => ({
          medicalRecords: state.medicalRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }))
      },

      // Code actions
      createPrescriptionCode: (code) => {
        set((state) => ({
          prescriptionCodes: [...state.prescriptionCodes, code],
        }))
      },

      createOrderCode: (code) => {
        set((state) => ({
          orderCodes: [...state.orderCodes, code],
        }))
      },

      usePrescriptionCode: (code) => {
        set((state) => ({
          prescriptionCodes: state.prescriptionCodes.map((c) =>
            c.code === code ? { ...c, used: true, usedAt: new Date().toISOString() } : c,
          ),
        }))
      },

      useOrderCode: (code) => {
        set((state) => ({
          orderCodes: state.orderCodes.map((c) =>
            c.code === code ? { ...c, used: true, usedAt: new Date().toISOString() } : c,
          ),
        }))
      },

      // Payment Settings
      updatePaymentSettings: (settings) => {
        set((state) => ({
          paymentSettings: { ...state.paymentSettings, ...settings },
        }))
      },

      // Lab Results
      addLabResult: (result) => {
        set((state) => ({
          labResults: [...state.labResults, result],
        }))
      },

      // Admin actions
      addDoctor: (doctor) => {
        set((state) => ({
          doctors: [...state.doctors, doctor],
        }))
      },

      updateDoctor: (id, updates) => {
        set((state) => ({
          doctors: state.doctors.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }))
      },

      deleteDoctor: (id) => {
        set((state) => ({
          doctors: state.doctors.filter((d) => d.id !== id),
        }))
      },

      addAlly: (ally) => {
        set((state) => ({
          allies: [...state.allies, ally],
        }))
      },

      updateAlly: (id, updates) => {
        set((state) => ({
          allies: state.allies.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }))
      },

      deleteAlly: (id) => {
        set((state) => ({
          allies: state.allies.filter((a) => a.id !== id),
        }))
      },

      addMembership: (membership) => {
        set((state) => ({
          memberships: [...state.memberships, membership],
        }))
      },

      updateMembership: (id, updates) => {
        set((state) => ({
          memberships: state.memberships.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }))
      },

      deleteMembership: (id) => {
        set((state) => ({
          memberships: state.memberships.filter((m) => m.id !== id),
        }))
      },

      addPromotion: (promotion) => {
        set((state) => ({
          promotions: [...state.promotions, promotion],
        }))
      },

      updatePromotion: (id, updates) => {
        set((state) => ({
          promotions: state.promotions.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }))
      },

      deletePromotion: (id) => {
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== id),
        }))
      },
    }),
    {
      name: "rch-storage",
    },
  ),
)

// Types for the RCH Medical Platform

export type UserRole = "public" | "patient" | "doctor" | "admin" | "ally"

export type Sector = "norte" | "centro" | "sur"

export type AppointmentStatus = "pending" | "paid" | "completed" | "cancelled" | "pending_verification"

export type ServiceType = "medical" | "laboratory" | "imaging" | "pharmacy" | "dental"

export type ModalityType = "presencial" | "telemedicina" | "domicilio"

export interface User {
  id: string
  email: string
  password: string
  role: UserRole
  name: string
  cedula?: string
  phone?: string
  membershipId?: string
  membershipExpiry?: string
  membershipActive?: boolean
  doctorId?: string
  allyId?: string
}

export interface Membership {
  id: string
  name: string
  price: number
  duration: string
  benefits: string[]
  discount: number
}

export interface Doctor {
  id: string
  name: string
  specialty: string
  sectors: Sector[]
  photo: string
  priceNormal: number
  priceMember: number
  schedule: DoctorSchedule[]
  modalities: ModalityType[]
  email: string
  phone: string
  addresses?: Record<Sector, string> // Address per sector, only shown after payment
}

export interface DoctorSchedule {
  day: number // 0-6
  slots: string[] // ["09:00", "09:30", ...]
  sector: Sector
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientCedula: string
  doctorId: string
  doctorName: string
  specialty: string
  date: string
  time: string
  sector: Sector
  modality: ModalityType
  reason: string
  status: AppointmentStatus
  price: number
  isMember: boolean
  createdAt: string
}

export interface Ally {
  id: string
  name: string
  type: ServiceType
  sector: Sector
  address: string
  phone: string
  discount: number
  photo: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  price: number
  includes: string[]
  validUntil: string
  image: string
}

export interface MedicalRecord {
  id: string
  patientId: string
  patientName: string
  patientCedula: string
  doctorId: string
  doctorName: string
  appointmentId: string
  date: string
  reason: string
  antecedents: string
  physicalExam: string
  diagnosis: DiagnosisItem[]
  evolution: string
  plan: string
  prescription: Prescription[]
  orders: MedicalOrder[]
}

export interface DiagnosisItem {
  code: string
  description: string
}

export interface Prescription {
  id: string
  medication: string
  dose: string
  frequency: string
  duration: string
  instructions: string
}

export interface MedicalOrder {
  id: string
  type: "laboratory" | "imaging" | "physiotherapy"
  description: string
  code: string
  used: boolean
  usedAt?: string
}

export interface PrescriptionCode {
  code: string
  patientId: string
  patientName: string
  patientCedula: string
  doctorId: string
  doctorName: string
  items: Prescription[]
  createdAt: string
  used: boolean
  usedAt?: string
}

export interface OrderCode {
  code: string
  type: "laboratory" | "imaging" | "physiotherapy"
  patientId: string
  patientName: string
  patientCedula: string
  doctorId: string
  doctorName: string
  description: string
  createdAt: string
  used: boolean
  usedAt?: string
}

export interface PaymentSettings {
  retentionPercentage: number // 40% by default
  paymentMethods: {
    transfer: boolean
    card: boolean
  }
  bankInfo: {
    bankName: string
    accountNumber: string
    accountType: string
    ownerName: string
    ownerId: string
  }
}

export interface LabResult {
  id: string
  orderId: string // order code
  patientId: string
  allyId: string
  allyName: string
  type: "laboratory" | "imaging"
  fileName: string
  uploadedAt: string
  description: string
}

export interface CIE10Code {
  code: string
  description: string
}

// ====================
// API Types (Backend)
// ====================

export type DoctorStatus = "Activo" | "Inactivo" | "DeVacaciones"

export interface ApiSpecialty {
  id: string
  name: string
  description: string
  imageUrl?: string
  createdAt?: string
  updatedAt?: string
  _count?: { doctors: number }
  doctors?: ApiDoctor[]
}

export interface ApiDoctor {
  id: string
  name: string
  email: string
  phone?: string
  experienceYears: number
  rating: number
  status: DoctorStatus
  specialty: {
    id: string
    name: string
    description?: string
  }
  user?: {
    id: string
    name: string
    email: string
  }
}

// DTOs for creating/updating
export interface CreateSpecialtyDto {
  name: string
  description: string
  imageUrl?: string
}

export interface UpdateSpecialtyDto {
  name?: string
  description?: string
  imageUrl?: string
}

export interface CreateDoctorDto {
  name: string
  email: string
  phone?: string
  experienceYears: number
  specialtyId: string
  userId?: string
  status?: DoctorStatus
}

export interface UpdateDoctorDto {
  name?: string
  email?: string
  phone?: string
  experienceYears?: number
  specialtyId?: string
  status?: DoctorStatus
}

// User Types
export type UserStatus = "Activo" | "Inactivo" | "Suspendido"

export interface ApiUser {
  id: string
  name?: string
  email: string
  status: UserStatus
  image?: string
  createdAt?: string
  updatedAt?: string
  admin?: {
    id: string
    name?: string
  } | null
  doctor?: {
    id: string
    name: string
    specialty?: {
      name: string
    }
  } | null
}

export interface CreateUserDto {
  name?: string
  email: string
  password?: string
  status?: UserStatus
}

export interface UpdateUserDto {
  name?: string
  email?: string
  password?: string
  status?: UserStatus
}

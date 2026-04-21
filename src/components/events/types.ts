export interface EventData {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  bannerUrl?: string;
  slug: string;
}

export interface Distance {
  id: string;
  name: string;
  label: string;
  description?: string;
  icon?: string;
}

export interface PricingStage {
  id: string;
  name: string;
  priceUsd: number;
  priceBs?: number;
  isActive: boolean;
  spotsLeft?: number;
  totalSpots?: number;
  startDate?: string;
  endDate?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl: string;
  url?: string;
  tier: 'gold' | 'silver' | 'bronze';
}

export interface RuleSection {
  id: string;
  title: string;
  content: string;
}

export interface ResultEntry {
  dorsal: string;
  name: string;
  category: string;
  distance: string;
  generalPlace: number;
  categoryPlace: number;
  time: string;
}

export interface BankInfo {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  pagoMovil?: string;
  zelle?: string;
}

export interface RegistrationData {
  firstName: string;
  lastName: string;
  idNumber: string;
  idType: 'cedula' | 'passport';
  birthDate: string;
  sex: 'M' | 'F';
  email: string;
  emailConfirm: string;
  distanceId: string;
  shirtSize?: string;
  paymentRef?: string;
  paymentProof?: File | null;
}

export interface EventContact {
  phone?: string;
  email?: string;
  whatsapp?: string;
}

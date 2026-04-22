export interface TenantInfoCard {
  title: string;
  description: string;
  icon: string;
}

export interface TenantSponsor {
  name: string;
  logo: string;
  type: "institutional" | "official";
}

export interface TenantOrganizer {
  name: string;
  logo: string;
  role?: string;
}

export interface TenantRoute {
  title: string;
  description: string;
  image: string;
  stravaLinks: { label: string; url: string }[];
}

export interface TenantCategory {
  name: string;
  range: string;
  description?: string;
}

export interface TenantAward {
  title: string;
  amount: string;
}

export interface TenantPricingStage {
  id: string;
  name: string;
  priceUsd: number;
  isActive: boolean;
  spotsLeft?: number;
}

export interface TenantRule {
  id: string;
  title: string;
  content: string;
}

export interface TenantData {
  id: string;
  name: string;
  title: string;
  year?: string;
  subtitle?: string;
  description: string;
  heroImage: string;
  logo: string;
  primaryColor: string;
  secondaryColor?: string;
  registrationLink: string;
  eventDate: string;
  eventTime?: string;
    city: string;
  infoCards?: TenantInfoCard[];
  sponsors?: TenantSponsor[];
  organizers?: TenantOrganizer[];
  pricingStages?: TenantPricingStage[];
  rules?: TenantRule[];
  social_media?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    threads?: string;
    tiktok?: string;
  };
  contact?: {
    whatsapp?: string;
    email?: string;
    phone?: string;
    instagram?: string;
  };
  eventDetails?: {
    route?: TenantRoute;
    categories?: TenantCategory[];
    awards?: {
      absolutes?: TenantAward[];
      byCategory?: { label: string; amount: string }[];
    };
    kit?: {
      items: string[];
      image: string;
    };
  };
  metadata: {
    keywords: string[];
    ogImage: string;
    ogTitle?: string;
    ogDescription?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterCard?: "summary" | "summary_large_image";
    gallery?: string[];
  };
}


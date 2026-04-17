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
}

export interface TenantAward {
  title: string;
  amount: string;
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
  location: string;
  infoCards?: TenantInfoCard[];
  sponsors?: TenantSponsor[];
  organizers?: TenantOrganizer[];
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
    gallery?: string[];
  };
}

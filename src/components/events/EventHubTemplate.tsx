import type { TenantData } from "../../types/tenant";
import { EventHero } from "./EventHero";
import { DistancesSection } from "./DistancesSection";
import { PricingSection } from "./PricingSection";
import { RulesSection } from "./RulesSection";
import { EventSponsors } from "./EventSponsors";
import { GallerySection } from "./GallerySection";
import { ResultsCenter } from "./ResultsCenter";
import { StickyNav } from "./StickyNav";
import { Footer } from "@/components/ui/Footer";
import type { EventData, Distance, Sponsor, GalleryImage, PricingStage, RuleSection } from "./types";
import { parseEventDate } from "@/lib/utils";

interface EventHubTemplateProps {
  tenant: TenantData;
  bcvRate?: number;
}

export const EventHubTemplate = ({ tenant, bcvRate }: EventHubTemplateProps) => {

  // Mapping TenantData to Hub components types
  const eventData: EventData = {
    name: tenant.title || tenant.name,
    date: tenant.eventDate,
    time: tenant.eventTime || "07:00 AM",
    location: tenant.city,
    city: tenant.city,
    description: tenant.description,
    bannerUrl: tenant.heroImage,
    logoUrl: tenant.logo,
    slug: tenant.id
  };

  // Map sponsors
  const sponsors: Sponsor[] = (tenant.sponsors || []).map((s, idx) => ({
    id: `sponsor-${idx}`,
    name: s.name,
    logoUrl: s.logo,
    tier: s.type === "institutional" ? "gold" : "silver"
  }));

  // Map gallery images from array of strings to GalleryImage[]
  const galleryImages: GalleryImage[] = tenant.metadata.gallery?.map((url: string, idx: number) => ({
    id: `gallery-${idx}`,
    url,
    alt: `${tenant.name} - Imagen ${idx + 1}`
  })) || [];

  // Map distances from tenant data
  const distances: Distance[] = tenant.eventDetails?.categories?.map((cat, idx) => {
    const hasGenderInfo = /masculino\/femenino/i.test(cat.name);
    return {
      id: `cat-${idx}`,
      name: cat.name.replace(/\s+masculino\/femenino/i, '').trim(),
      label: cat.range,
      description: cat.description || (hasGenderInfo ? "Masculino / Femenino" : `Categoría para participantes de ${cat.range}.`)
    };
  }) || [
    { id: "main", name: "Ruta Principal", label: tenant.city, description: tenant.description }
  ];

  // Map pricing stages from tenant data
  const pricingStages: PricingStage[] = tenant.pricingStages || [
    { id: "pre-sale", name: "Inscripción", priceUsd: 0, isActive: true }
  ];

  // Map rules and policies from tenant data
  const rules: RuleSection[] = tenant.rules || [
    { id: "transfer", title: "Transferencia de Cupo", content: "Las inscripciones son personales e intransferibles bajo ninguna circunstancia." },
    { id: "refund", title: "Política de Reembolso", content: "No se realizarán reembolsos de dinero una vez procesado el pago de la inscripción." },
    { id: "age", title: "Edad Mínima", content: "La edad mínima para participar es de 18 años, o menores con autorización de representante." },
    { id: "medical", title: "Salud", content: "Todos los participantes declaran estar en óptimas condiciones físicas y de salud para completar el evento." }
  ];


  return (
    <div className="min-h-screen bg-charcoal text-foreground selection:bg-ember selection:text-white">
      <StickyNav 
        eventSlug={tenant.id} 
        eventName={tenant.title || tenant.name} 
        showGallery={galleryImages.length > 0}
        showSponsors={sponsors.length > 0}
        showResults={false} // Keeping it false for now as per ResultsCenter visible={false}
      />
      
      <main>
        <EventHero 
          event={eventData} 
          countdownTarget={parseEventDate(tenant.eventDate) || new Date("2026-12-31T23:59:59")} 
        />
        
        <DistancesSection 
          description={tenant.description}
          distances={distances}
          routeMapUrl={tenant.eventDetails?.route?.image}
          stravaUrl={tenant.eventDetails?.route?.stravaLinks?.[0]?.url}
          logoUrl={tenant.logo}
        />
        
        <PricingSection stages={pricingStages} bcvRate={bcvRate} />

        
        <RulesSection rules={rules} />
        
        {galleryImages.length > 0 && <GallerySection images={galleryImages} />}

        {/* Results section - only visible when event is finished or results uploaded */}
        <ResultsCenter visible={false} />
        
        {sponsors.length > 0 && <EventSponsors sponsors={sponsors} />}
      </main>

      <Footer 
        isEvent
        logoUrl={tenant.logo}
        contact={{ 
          whatsapp: tenant.contact?.whatsapp || "584120000000", 
          email: tenant.contact?.email || "info@zonacrono.com" 
        }} 
        socialMedia={tenant.social_media}
        saasName="ZonaCrono"
        saasUrl="/"
      />
    </div>
  );
};


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
    slug: tenant.id,
    organization: tenant.organization
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

  // Map categories grouped by gender
  const allCategories = tenant.eventDetails?.categories || [];

  const femaleDistances: Distance[] = allCategories
    .filter(cat => (cat as any).gender === 'FEMALE' || /femenino/i.test(cat.name))
    .map((cat, idx) => ({
      id: `fem-${idx}`,
      name: cat.name.replace(/\s*[\/\-]?\s*femenino\s*[\/\-]?\s*/gi, ' ').replace(/\s+/g, ' ').trim(),
      label: cat.range,
      description: cat.description || `Categoría femenina para participantes de ${cat.range}.`,
      gender: 'FEMALE' as const
    }));

  const maleDistances: Distance[] = allCategories
    .filter(cat => (cat as any).gender === 'MALE' || /masculino/i.test(cat.name))
    .map((cat, idx) => ({
      id: `male-${idx}`,
      name: cat.name.replace(/\s*[\/\-]?\s*masculino\s*[\/\-]?\s*/gi, ' ').replace(/\s+/g, ' ').trim(),
      label: cat.range,
      description: cat.description || `Categoría masculina para participantes de ${cat.range}.`,
      gender: 'MALE' as const
    }));


  const mixedDistances: Distance[] = allCategories
    .filter(cat => (cat as any).gender === 'MIXED' || (!/femenino/i.test(cat.name) && !/masculino/i.test(cat.name)))
    .map((cat, idx) => ({
      id: `gen-${idx}`,
      name: cat.name.trim(),
      label: cat.range,
      description: cat.description || `Categoría para participantes de ${cat.range}.`,
      gender: 'MIXED' as const
    }));

  // Fallback if no categories defined
  const distances: Distance[] = mixedDistances.length > 0 ? mixedDistances : (
    allCategories.length === 0 ? [{ id: "main", name: "Ruta Principal", label: tenant.city, description: tenant.description }] : []
  );

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
          event={eventData}
          description={tenant.description}
          distances={distances}
          femaleDistances={femaleDistances}
          maleDistances={maleDistances}
          routeMapUrl={tenant.eventDetails?.route?.image}
          routeDescription={tenant.eventDetails?.route?.description}
          stravaUrl={tenant.eventDetails?.route?.stravaLinks?.[0]?.url}
          logoUrl={tenant.logo}
          organization={tenant.organization}
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
          email: tenant.organization?.email || tenant.contact?.email || "info@zonacrono.com",
          phone: tenant.organization?.phone || tenant.contact?.phone
        }} 
        socialMedia={tenant.social_media}
        saasName="ZonaCrono"
        saasUrl="/"
      />
    </div>
  );
};


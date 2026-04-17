import type { TenantData } from "../../types/tenant";
import HeroSection from "./HeroSection";
import DistancesSection from "./DistancesSection";
import PricingSection from "./PricingSection";
import RulesSection from "./RulesSection";
import SponsorsSection from "./SponsorsSection";
import GallerySection from "./GallerySection";
import ResultsCenter from "./ResultsCenter";
import StickyNav from "./StickyNav";
import EventFooter from "./EventFooter";
import type { EventData, Distance, Sponsor, GalleryImage, PricingStage, RuleSection } from "./types";

interface EventHubTemplateProps {
  tenant: TenantData;
}

const EventHubTemplate = ({ tenant }: EventHubTemplateProps) => {
  // Mapping TenantData to Hub components types
  const eventData: EventData = {
    name: tenant.title || tenant.name,
    date: tenant.eventDate,
    time: "07:00 AM", // Default or extract from subtitle if possible
    location: tenant.location,
    description: tenant.description,
    bannerUrl: tenant.heroImage,
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

  // Mock distances (In a real scenario, this would come from a data source)
  const distances: Distance[] = [
    { id: "10k", name: "10K", label: "Carrera Competitiva", description: "Circuito certificado de 10 kilómetros por la Av. Rómulo Gallegos." },
    { id: "5k", name: "5K", label: "Caminata Recreativa", description: "Recorrido para toda la familia y caminantes recreativos." }
  ];

  // Mock pricing stages (since TenantData doesn't have them yet)
  const pricingStages: PricingStage[] = [
    { id: "pre-sale", name: "Pre-venta", priceUsd: 15, isActive: true, spotsLeft: 45 },
    { id: "regular", name: "Venta Regular", priceUsd: 20, isActive: false },
    { id: "last-call", name: "Última Hora", priceUsd: 25, isActive: false }
  ];

  // Map rules and policies
  const rules: RuleSection[] = [
    { id: "transfer", title: "Transferencia de Cupo", content: "Las inscripciones son personales e intransferibles bajo ninguna circunstancia." },
    { id: "refund", title: "Política de Reembolso", content: "No se realizarán reembolsos de dinero una vez procesado el pago de la inscripción." },
    { id: "age", title: "Edad Mínima", content: "La edad mínima para participar en los 10K es de 16 años cumplidos al día del evento." },
    { id: "medical", title: "Certificado Médico", content: "Todos los participantes declaran estar en óptimas condiciones físicas y de salud para completar la distancia seleccionada." }
  ];

  return (
    <div className="min-h-screen bg-charcoal text-foreground selection:bg-ember selection:text-white">
      <StickyNav eventSlug={tenant.id} />
      
      <main>
        <HeroSection event={eventData} countdownTarget={new Date("2025-08-30T07:00:00")} />
        
        <DistancesSection 
          description={tenant.description}
          distances={distances}
          routeMapUrl={tenant.eventDetails?.route?.image}
          stravaUrl={tenant.eventDetails?.route?.stravaLinks?.[0]?.url}
        />
        
        <PricingSection stages={pricingStages} bcvRate={54.20} />
        
        <RulesSection rules={rules} />
        
        <GallerySection images={galleryImages} />

        {/* Results section - only visible when event is finished or results uploaded */}
        <ResultsCenter visible={false} />
        
        <SponsorsSection sponsors={sponsors} />
      </main>

      <EventFooter 
        contact={{ 
          whatsapp: "584120000000", 
          email: "info@zonacrono.com" 
        }} 
        saasName="ZonaCrono"
        saasUrl="https://zonacrono.com"
      />
    </div>
  );
};

export default EventHubTemplate;

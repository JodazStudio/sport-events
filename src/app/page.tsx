import { Suspense } from "react";
import { 
  Navbar, 
  HeroSection, 
  StatsBar, 
  AboutSection, 
  ServicesSection, 
  EventsSection, 
  EventsSkeleton,
  ContactCTA, 
  Footer 
} from "@/components/landing";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZonaCrono | Impulsa tus eventos deportivos",
  description: "Plataforma integral para inscripciones, gestión de resultados en tiempo real y estrategias de promoción para carreras, triatlones y eventos deportivos.",
  alternates: {
    canonical: '/',
  }
};

export default async function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zonacrono',
    url: 'https://zonacrono.com',
    logo: 'https://zonacrono.com/zonacrono_light.png',
    image: 'https://zonacrono.com/zonacrono_light.png',
    description: 'Plataforma integral para gestión, software y promoción de eventos deportivos.',
    sameAs: [
      'https://instagram.com/zonacrono',
    ]
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <HeroSection />
        <StatsBar />
        <AboutSection />
        <ServicesSection />
        
        <Suspense fallback={<EventsSkeleton />}>
          <EventsSection />
        </Suspense>

        <ContactCTA />
        
        {/* Resultados Section */}
        <section id="resultados" className="hidden bg-card py-24">
          <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
            <div className="mb-6 inline-flex items-center gap-2 border px-4 py-1.5 bg-background">
              <span className="h-2 w-2 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Resultados
              </span>
            </div>
            <h2 className="font-satoshi text-4xl font-black text-foreground md:text-5xl italic">
              RESULTADOS <span className="text-primary">EN VIVO</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground font-medium">
              Consulta los resultados de nuestros eventos más recientes. Actualización en tiempo real durante la competencia.
            </p>
            <Link 
              href="/dashboard"
              className="btn-mechanical mt-8 inline-flex bg-primary text-primary-foreground"
            >
              Consultar Resultados
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

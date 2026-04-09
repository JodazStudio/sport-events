import Navbar from "@/components/apex/Navbar";
import HeroSection from "@/components/apex/HeroSection";
import StatsBar from "@/components/apex/StatsBar";
import AboutSection from "@/components/apex/AboutSection";
import ServicesSection from "@/components/apex/ServicesSection";
import EventsSection from "@/components/apex/EventsSection";
import ContactCTA from "@/components/apex/ContactCTA";
import Footer from "@/components/apex/Footer";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Apex Racing Live | Cronometraje Deportivo Profesional",
  description: "Soluciones de cronometraje deportivo con tecnología RFID de última generación. Resultados en tiempo real para carreras, triatlones, ciclismo y más.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <AboutSection />
        <ServicesSection />
        <EventsSection />
        <ContactCTA />
        
        {/* Resultados Section directly here as in source */}
        <section id="resultados" className="bg-card py-24">
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

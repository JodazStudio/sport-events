import { Calendar, MapPin, Euro } from "lucide-react";
import { Button } from "../ui/button";
import heroImage from "@/assets/backgrounds/hero-background.jpg";

export const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 mt-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage.src}
          alt="Carrera Santa Rosa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Badge */}
          <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-fade-in">
            <span className="text-sm font-semibold uppercase tracking-wide">
              I Edición 2025
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fade-in-up leading-tight">
            Carrera Popular
            <span className="block bg-gradient-to-r from-secondary to-white bg-clip-text text-transparent mt-2">
              Santa Rosa de Lima
            </span>
          </h1>

          {/* Event Details */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full border border-white/30">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">23 Agosto 2025 • 18:30</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-full border border-white/30">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">La Laguna, Guamasa</span>
            </div>
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-scale-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black mb-2">5 KM</div>
              <div className="text-lg font-medium opacity-90">Circuito Urbano</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-2 text-4xl font-black mb-2">
                <Euro className="w-8 h-8" />
                <span>10</span>
              </div>
              <div className="text-lg font-medium opacity-90">Inscripción</div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-black mb-2">500+</div>
              <div className="text-lg font-medium opacity-90">Participantes</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button 
              size="lg" 
              className="bg-gradient-cta hover:opacity-90 transition-opacity text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Inscríbete Ahora
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 font-bold text-lg px-8 py-6 rounded-full transition-all duration-300"
            >
              Ver Recorrido
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

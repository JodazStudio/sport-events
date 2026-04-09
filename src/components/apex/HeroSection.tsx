import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-hero text-hero-foreground"
    >
      {/* Orange needle animation at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
        <div className="h-full w-full bg-primary animate-needle" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        {/* Overline */}
        <div className="mb-6 inline-flex items-center gap-2 border border-primary/30 px-4 py-1.5">
          <span className="h-2 w-2 bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Cronometraje Profesional
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-satoshi text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl italic">
          PRECISIÓN EN
          <br />
          <span className="text-primary">LA LÍNEA</span>
          <br />
          DE META
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-hero-foreground/70 md:text-xl font-medium">
          Soluciones de cronometraje deportivo con tecnología RFID de última generación.
          Resultados en tiempo real para carreras, triatlones, ciclismo y más.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#servicios"
            className="btn-mechanical bg-primary text-primary-foreground"
          >
            Nuestros Servicios
          </a>
          <a
            href="#contacto"
            className="btn-mechanical-outline border-hero-foreground/30 text-hero-foreground"
            style={{
              boxShadow: "4px 4px 0px 0px hsl(0 0% 100% / 0.2)",
            }}
          >
            Solicitar Cotización
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-hero-foreground/40">
          Scroll
        </span>
        <ChevronDown className="h-4 w-4 text-hero-foreground/40 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;

import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";

const ContactCTA = () => {
  return (
    <section
      id="contacto"
      className="relative bg-hero py-24 text-hero-foreground"
    >
      {/* Needle bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20">
        <div className="h-full w-full bg-primary animate-needle" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center lg:px-8">
        <div className="mb-6 inline-flex items-center gap-2 border border-primary/30 px-4 py-1.5">
          <span className="h-2 w-2 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
            Contacto
          </span>
        </div>

        <h2 className="font-satoshi text-4xl font-black leading-tight md:text-5xl italic">
          ¿ORGANIZAS UN EVENTO
          <br />
          <span className="text-primary">DEPORTIVO?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-hero-foreground/70 font-medium">
          Contáctanos para una cotización personalizada. Nos adaptamos a eventos
          de cualquier escala.
        </p>

        {/* Contact info */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/5804121315110"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-mechanical bg-primary text-primary-foreground"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            WhatsApp
          </a>
          <a
            href="mailto:jesus@jodaz.xyz"
            className="btn-mechanical-outline border-hero-foreground/30 text-hero-foreground"
            style={{
              boxShadow: "4px 4px 0px 0px hsl(0 0% 100% / 0.2)",
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar Email
          </a>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-8">
          <div className="flex items-center gap-2 text-sm text-hero-foreground/60">
            <Phone className="h-4 w-4" />
            <span className="font-mono">+58 0412 131 5110</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-hero-foreground/60">
            <Mail className="h-4 w-4" />
            <span className="font-mono">jesus@jodaz.xyz</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-hero-foreground/60">
            <MapPin className="h-4 w-4" />
            <span className="font-mono">Carúpano, Venezuela</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;

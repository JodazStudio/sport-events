import { Phone, Mail, MessageCircle } from "lucide-react";
import type { EventContact } from "@/components/events/types";

interface FooterProps {
  isEvent?: boolean;
  contact?: EventContact;
  saasName?: string;
  saasUrl?: string;
}

export const Footer = ({ 
  isEvent = false, 
  contact, 
  saasName = "ZonaCrono", 
  saasUrl = "/" 
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-charcoal border-t-2 border-border/50">
      <div className="container mx-auto px-4">
        {/* Row 1: Event Details (Only for event pages) */}
        {isEvent && (
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10 pb-10 border-b border-border/30">
            {contact?.phone && (
              <a 
                href={`tel:${contact.phone}`} 
                className="flex items-center gap-2.5 text-muted-foreground hover:text-ember transition-all duration-300 font-satoshi text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] group"
              >
                <div className="p-2 rounded-full bg-border/30 group-hover:bg-ember/10 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-ember" />
                </div>
                {contact.phone}
              </a>
            )}
            {contact?.email && (
              <a 
                href={`mailto:${contact.email}`} 
                className="flex items-center gap-2.5 text-muted-foreground hover:text-ember transition-all duration-300 font-satoshi text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] group"
              >
                <div className="p-2 rounded-full bg-border/30 group-hover:bg-ember/10 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-ember" />
                </div>
                {contact.email}
              </a>
            )}
            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-muted-foreground hover:text-ember transition-all duration-300 font-satoshi text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] group"
              >
                <div className="p-2 rounded-full bg-border/30 group-hover:bg-ember/10 transition-colors">
                  <MessageCircle className="w-3.5 h-3.5 text-ember" />
                </div>
                WhatsApp
              </a>
            )}
            {!contact && (
              <p className="text-muted-foreground/50 font-satoshi text-[10px] uppercase tracking-widest italic">
                Información de contacto pendiente
              </p>
            )}
          </div>
        )}

        {/* Row 2: Credits & Branding */}
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-[10px] text-muted-foreground font-satoshi uppercase tracking-[0.25em] font-black flex items-center justify-center gap-3">
                <a href={saasUrl} className="hover:text-ember transition-colors">
                  {saasName}
                </a>
                <span className="text-ember text-base opacity-50">•</span>
                <a 
                  href="https://jodaz.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-ember transition-colors"
                >
                  Jodaz.xyz
                </a>
              </p>
              
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/40">
                  © {currentYear} {saasName}. Todos los derechos reservados.
                </span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60">
                  Hecho con precisión 🏁
                </span>
              </div>
            </div>
          </div>
      </div>
    </footer>
  );
};

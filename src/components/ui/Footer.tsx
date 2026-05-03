import { Phone, Mail, MessageCircle, Instagram, Facebook, Twitter, AtSign } from "lucide-react";
import type { EventContact } from "@/components/events/types";

interface FooterProps {
  isEvent?: boolean;
  contact?: EventContact;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    threads?: string;
    tiktok?: string;
  };
  saasName?: string;
  saasUrl?: string;
  logoUrl?: string;
}

export const Footer = ({ 
  isEvent = false, 
  contact, 
  socialMedia,
  saasName = "ZonaCrono", 
  saasUrl = "/",
  logoUrl
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-charcoal border-t-2 border-border/50">
      <div className="container mx-auto px-4">
        {/* Row 1: Event Details (Only for event pages) */}
        {isEvent && (
          <div className="flex flex-col gap-10 mb-10 pb-10 border-b border-border/30">
            {logoUrl && (
              <div className="flex justify-center mb-4">
                <img 
                  src={logoUrl} 
                  alt="Evento Logo" 
                  className="h-16 w-auto object-contain " 
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
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
              {!contact && !socialMedia && (
                <p className="text-muted-foreground/50 font-satoshi text-[10px] uppercase tracking-widest italic">
                  Información de contacto pendiente
                </p>
              )}
            </div>

            {/* Social Media Links */}
            {socialMedia && Object.values(socialMedia).some(val => val) && (
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {socialMedia.instagram && (
                  <a 
                    href={socialMedia.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none border-2 border-border/50 text-muted-foreground hover:text-white hover:bg-ember hover:border-ember transition-all duration-300 group"
                    title="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialMedia.facebook && (
                  <a 
                    href={socialMedia.facebook} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none border-2 border-border/50 text-muted-foreground hover:text-white hover:bg-ember hover:border-ember transition-all duration-300 group"
                    title="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {socialMedia.twitter && (
                  <a 
                    href={socialMedia.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none border-2 border-border/50 text-muted-foreground hover:text-white hover:bg-ember hover:border-ember transition-all duration-300 group"
                    title="X (Twitter)"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {socialMedia.threads && (
                  <a 
                    href={socialMedia.threads} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none border-2 border-border/50 text-muted-foreground hover:text-white hover:bg-ember hover:border-ember transition-all duration-300 group"
                    title="Threads"
                  >
                    <AtSign className="w-4 h-4" />
                  </a>
                )}
                {socialMedia.tiktok && (
                  <a 
                    href={socialMedia.tiktok} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-none border-2 border-border/50 text-muted-foreground hover:text-white hover:bg-ember hover:border-ember transition-all duration-300 group"
                    title="TikTok"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-4 h-4"
                    >
                      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                    </svg>
                  </a>
                )}
              </div>
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

import { AnimatedContent } from "@/components/ui";
import { Phone, Mail, MessageCircle } from "lucide-react";
import type { EventContact } from "./types";

interface EventFooterProps {
  contact?: EventContact;
  saasName?: string;
  saasUrl?: string;
}

export const EventFooter = ({ contact, saasName, saasUrl }: EventFooterProps) => {
  return (
    <footer className="py-12 bg-charcoal border-t-2 border-border">
      <div className="container mx-auto px-4">
        {/* Contact */}
        <AnimatedContent>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-8">
            {contact?.phone && (
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-ember transition-colors font-satoshi text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ember" />
                {contact.phone}
              </a>
            )}
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-ember transition-colors font-satoshi text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ember" />
                {contact.email}
              </a>
            )}
            {contact?.whatsapp && (
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-ember transition-colors font-satoshi text-[10px] sm:text-xs font-bold uppercase tracking-widest"
              >
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ember" />
                WhatsApp
              </a>
            )}
            {!contact && (
              <p className="text-muted-foreground font-satoshi text-xs uppercase tracking-widest italic opacity-50">
                Información de contacto pendiente.
              </p>
            )}
          </div>
        </AnimatedContent>

        {/* White label */}
        <AnimatedContent delay={0.2} distance={20}>
          <div className="text-center border-t border-border/30 pt-8">
            <p className="text-[10px] text-muted-foreground font-satoshi uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2">
              <a href="/" className="hover:text-ember transition-colors">
                {saasName || "ZonaCrono"}
              </a>
              <span className="text-ember">•</span>
              <a 
                href="https://jodaz.xyz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-ember transition-colors"
              >
                Jodaz.xyz
              </a>
            </p>
          </div>
        </AnimatedContent>
      </div>
    </footer>
  );
};


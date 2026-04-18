import { Handshake } from "lucide-react";
import type { Sponsor } from "./types";
import AnimatedContent from "../AnimatedContent";

interface SponsorsSectionProps {
  sponsors?: Sponsor[];
}

const SponsorsSection = ({ sponsors }: SponsorsSectionProps) => {
  return (
    <section id="sponsors" className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedContent>
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            Patrocinadores
          </h2>
        </AnimatedContent>

        {sponsors && sponsors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-5xl mx-auto items-center">
            {sponsors.map((sponsor, idx) => (
              <AnimatedContent key={sponsor.id} delay={0.1 + idx * 0.05} distance={20} scale={0.9}>
                <a
                  href={sponsor.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary/40 rounded-none p-6 flex items-center justify-center h-28 hover:bg-secondary/60 transition-colors border-2 border-border hover:border-ember/50 group cursor-pointer"
                >
                  {sponsor.logoUrl ? (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="max-h-16 max-w-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-muted-foreground font-satoshi text-[10px] text-center font-bold uppercase tracking-widest">{sponsor.name}</span>
                  )}
                </a>
              </AnimatedContent>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Handshake className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-satoshi font-medium uppercase tracking-widest text-sm">
              Los patrocinadores aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorsSection;

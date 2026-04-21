"use client";
import { AnimatedContent } from "@/components/ui";


import { Handshake } from "lucide-react";
import type { Sponsor } from "./types";
import { LogoLoop, type LogoItem } from "@/components/landing";

interface SponsorsSectionProps {
  sponsors?: Sponsor[];
}

export const EventSponsors = ({ sponsors }: SponsorsSectionProps) => {
  const logoItems = (sponsors || []).map((sponsor) => ({
    src: sponsor.logoUrl || "",
    alt: sponsor.name,
    href: sponsor.url || "#",
    title: sponsor.name,
  }));

  return (
    <section id="sponsors" className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedContent>
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            Patrocinadores
          </h2>
        </AnimatedContent>

        {sponsors && sponsors.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <LogoLoop
              logos={logoItems}
              logoHeight={96}
              gap={64}
              speed={80}
              fadeOut={true}
              pauseOnHover={true}
              renderItem={(item: LogoItem) => (
                <div className="group cursor-pointer px-4">
                  {"src" in item && (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-24 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />
                  )}
                </div>
              )}
            />
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



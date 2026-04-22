"use client";
import { Card, CardContent, SplitText } from "@/components/ui";

import * as LucideIcons from "lucide-react";
import { TenantData } from "@/types";

interface RaceInfoProps {
  data: TenantData;
}

export const RaceInfo = ({ data }: RaceInfoProps) => {
  const infoCards = (data.infoCards || []).map((card, index) => {
    const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.HelpCircle;
    return {
      ...card,
      icon: IconComponent,
      color: index % 2 === 0 ? "text-primary" : "text-secondary",
      bgColor: index % 2 === 0 ? "bg-primary/10" : "bg-secondary/10",
      link: card.title === "Inscripciones" ? data.registrationLink : "#",
    };
  });

  return (
    <section id="informacion" className="py-20 bg-brand-dark-purple relative overflow-hidden">
      {/* Decorative yellow scribbles */}
      <div className="absolute top-0 left-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500">
          <path d="M10,20 Q30,10 50,20 T90,20" stroke="currentColor" fill="none" strokeWidth="2" />
          <path d="M15,40 Q35,30 55,40 T95,40" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-500">
          <path d="M10,80 Q30,90 50,80 T90,80" stroke="currentColor" fill="none" strokeWidth="2" />
          <path d="M15,60 Q35,70 55,60 T95,60" stroke="currentColor" fill="none" strokeWidth="2" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <SplitText
            text="INFORMACIÓN"
            className="text-4xl md:text-5xl font-permanent font-bold text-white mb-4 py-4"
            delay={50}
            from={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            to={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            ease="bounce.out"
            splitType="chars"
            tag="h2"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {infoCards.map((card, index) => (
            <a 
              key={index}
              href={card.link}
              className="block"
            >
              <Card 
                className="border border-white/20 bg-white hover:border-yellow-500/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up cursor-pointer rounded-2xl"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-4 ${card.bgColor} rounded-2xl flex-shrink-0`}>
                      <card.icon className={`w-8 h-8 ${card.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-black mb-3 font-permanent text-left">
                        {card.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line text-left">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

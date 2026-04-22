import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, AnimatedContent } from "@/components/ui";
import { ScrollText } from "lucide-react";
import type { RuleSection } from "./types";

interface RulesSectionProps {
  rules?: RuleSection[];
  kitDelivery?: {
    dates?: string;
    hours?: string;
    address?: string;
  };
}

export const RulesSection = ({ rules, kitDelivery }: RulesSectionProps) => {
  return (
    <section id="reglamento" className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedContent>
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            Reglamento y Políticas
          </h2>
        </AnimatedContent>

        {rules && rules.length > 0 ? (
          <Accordion type="multiple" className="space-y-4">
            {rules.map((rule, idx) => (
              <AnimatedContent key={rule.id} delay={0.1 + idx * 0.05} distance={20}>
                <AccordionItem value={rule.id} className="border-2 border-black bg-charcoal text-white px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <AccordionTrigger className="font-satoshi font-black text-white hover:no-underline hover:text-ember uppercase tracking-wider text-sm cursor-pointer italic py-6">
                    {rule.title}
                  </AccordionTrigger>
                  <AccordionContent className="font-satoshi text-white/80 leading-relaxed text-sm pb-6 border-t border-white/10 pt-4">
                    {rule.content}
                  </AccordionContent>
                </AccordionItem>
              </AnimatedContent>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-border">
            <ScrollText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-satoshi font-medium uppercase tracking-widest text-sm italic">
              El reglamento será publicado por el organizador.
            </p>
          </div>
        )}

        {kitDelivery && (
          <AnimatedContent delay={0.5} distance={40}>
            <div className="mt-12 bg-charcoal rounded-none p-8 border-2 border-black shadow-[8px_8px_0px_0px_hsl(var(--primary))] text-white">
              <h3 className="font-satoshi font-black text-2xl text-white mb-4 italic uppercase tracking-tight">Entrega de Kits</h3>
              <div className="space-y-4 font-satoshi text-sm">
                {kitDelivery.dates && (
                  <p className="flex items-center gap-3">
                    <span className="bg-ember text-white font-black uppercase text-[9px] tracking-widest px-2 py-1 italic">Fechas</span> 
                    <span className="text-white/90 font-bold">{kitDelivery.dates}</span>
                  </p>
                )}
                {kitDelivery.hours && (
                  <p className="flex items-center gap-3">
                    <span className="bg-ember text-white font-black uppercase text-[9px] tracking-widest px-2 py-1 italic">Horario</span> 
                    <span className="text-white/90 font-bold">{kitDelivery.hours}</span>
                  </p>
                )}
                {kitDelivery.address && (
                  <div className="flex flex-col gap-2">
                    <span className="bg-ember text-white font-black uppercase text-[9px] tracking-widest px-2 py-1 italic w-fit">Dirección</span> 
                    <p className="text-white/70 italic leading-relaxed">{kitDelivery.address}</p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedContent>
        )}
      </div>
    </section>
  );
};


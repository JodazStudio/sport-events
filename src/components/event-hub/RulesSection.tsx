import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
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

const RulesSection = ({ rules, kitDelivery }: RulesSectionProps) => {
  return (
    <section id="reglamento" className="py-20 bg-card">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
          Reglamento y Políticas
        </h2>

        {rules && rules.length > 0 ? (
          <Accordion type="multiple" className="space-y-4">
            {rules.map((rule) => (
              <AccordionItem key={rule.id} value={rule.id} className="border-2 border-border bg-secondary/30 px-6 rounded-none">
                <AccordionTrigger className="font-satoshi font-bold text-foreground hover:no-underline hover:text-ember uppercase tracking-wider text-sm cursor-pointer">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent className="font-satoshi text-muted-foreground leading-relaxed text-sm">
                  {rule.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-16">
            <ScrollText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-satoshi font-medium uppercase tracking-widest text-sm">
              El reglamento será publicado por el organizador.
            </p>
          </div>
        )}

        {kitDelivery && (
          <div className="mt-12 bg-secondary/50 rounded-none p-8 border-2 border-border border-dashed">
            <h3 className="font-satoshi font-black text-2xl text-foreground mb-4 italic uppercase">Entrega de Kits</h3>
            <div className="space-y-3 font-satoshi text-sm text-muted-foreground">
              {kitDelivery.dates && (
                <p className="flex items-center gap-2">
                  <span className="text-ember font-bold uppercase text-[10px] tracking-widest">Fechas:</span> 
                  <span className="text-foreground">{kitDelivery.dates}</span>
                </p>
              )}
              {kitDelivery.hours && (
                <p className="flex items-center gap-2">
                  <span className="text-ember font-bold uppercase text-[10px] tracking-widest">Horario:</span> 
                  <span className="text-foreground">{kitDelivery.hours}</span>
                </p>
              )}
              {kitDelivery.address && (
                <p className="flex flex-col gap-1">
                  <span className="text-ember font-bold uppercase text-[10px] tracking-widest">Dirección:</span> 
                  <span className="text-foreground">{kitDelivery.address}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RulesSection;

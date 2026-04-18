import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertTriangle, Tag } from "lucide-react";
import type { PricingStage } from "./types";
import AnimatedContent from "../AnimatedContent";

interface PricingSectionProps {
  stages?: PricingStage[];
  bcvRate?: number;
}

const PricingSection = ({ stages, bcvRate }: PricingSectionProps) => {
  return (
    <section id="precios" className="py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedContent>
          <h2 className={`font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground text-center italic uppercase tracking-tighter ${bcvRate ? 'mb-4' : 'mb-12'}`}>
            Precios e Inscripción
          </h2>
        </AnimatedContent>
        {bcvRate && (
          <AnimatedContent delay={0.1}>
            <p className="text-center text-muted-foreground font-satoshi text-sm mb-12 uppercase tracking-widest">
              Tasa BCV del día: <span className="text-ember font-bold">Bs. {bcvRate.toFixed(2)}</span>
            </p>
          </AnimatedContent>
        )}

        {stages && stages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {stages.map((stage, idx) => (
              <AnimatedContent key={stage.id} delay={0.2 + idx * 0.1} distance={40}>
                <Card
                  className={`relative overflow-hidden transition-all rounded-none border-2 h-full ${
                    stage.isActive
                      ? "bg-card border-ember shadow-lg shadow-ember/10 md:scale-105"
                      : "bg-secondary/50 border-border opacity-60"
                  }`}
                >
                  {stage.isActive && (
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-ember" />
                  )}
                  <CardHeader className="text-center pb-2">
                    {stage.isActive && (
                      <Badge className="bg-ember text-ember-foreground w-fit mx-auto mb-2 font-satoshi text-[10px] uppercase font-bold rounded-none">
                        Etapa Activa
                      </Badge>
                    )}
                    <CardTitle className="font-satoshi font-black text-xl sm:text-2xl text-foreground italic uppercase">
                      {stage.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-3">
                    <div>
                      <span className="font-satoshi font-black text-4xl sm:text-5xl text-foreground italic">
                        ${stage.priceUsd}
                      </span>
                      <span className="text-muted-foreground font-satoshi text-xs sm:text-sm ml-1 uppercase font-bold">USD</span>
                    </div>
                    {stage.isActive && bcvRate && (
                      <p className="text-sm text-muted-foreground font-satoshi font-medium">
                        ≈ Bs. {(stage.priceUsd * bcvRate).toFixed(2)}
                      </p>
                    )}
                    {stage.isActive && stage.spotsLeft !== undefined && (
                      <div className="flex items-center justify-center gap-2 text-ember font-satoshi text-xs font-bold uppercase">
                        <AlertTriangle className="w-4 h-4" />
                        ¡Últimos {stage.spotsLeft} cupos!
                      </div>
                    )}
                    {!stage.isActive && (
                      <p className="text-xs text-muted-foreground font-satoshi italic uppercase">Próximamente</p>
                    )}
                  </CardContent>
                </Card>
              </AnimatedContent>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground font-satoshi font-medium uppercase tracking-widest">
              Las etapas de precios serán configuradas por el organizador.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;

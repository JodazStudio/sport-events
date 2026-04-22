import { Card, CardContent, Button, AnimatedContent } from "@/components/ui";
import { Route, Map } from "lucide-react";
import type { Distance } from "./types";

interface DistancesSectionProps {
  description?: string;
  distances?: Distance[];
  routeMapUrl?: string;
  routeDescription?: string;
  stravaUrl?: string;
  logoUrl?: string;
  organization?: {
    name: string;
    logo_url?: string;
  };
}

export const DistancesSection = ({ 
  description, 
  distances, 
  routeMapUrl, 
  routeDescription,
  stravaUrl, 
  logoUrl,
  organization
}: DistancesSectionProps) => {
  return (
    <>
      {/* Detalles */}
      <section id="detalles" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedContent>
            {organization?.name && (
              <div className="mb-6 flex flex-col items-center gap-4">
                {organization.logo_url && (
                  <img 
                    src={organization.logo_url} 
                    alt={organization.name} 
                    className="h-12 w-auto object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
                  />
                )}
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black">
                  Organizado por <span className="text-ember">{organization.name}</span>
                </span>
              </div>
            )}
            
            {!organization?.name && logoUrl && (
              <div className="mb-10 flex justify-center">
                <img 
                  src={logoUrl} 
                  alt="Logo del Evento" 
                  className="h-20 sm:h-28 w-auto object-contain filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                />
              </div>
            )}
            <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
              Detalles del Evento
            </h2>
          </AnimatedContent>

          <AnimatedContent delay={0.2}>
            {description ? (
              <p className="text-muted-foreground font-satoshi text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-center mb-16 leading-relaxed">
                {description}
              </p>
            ) : (
              <p className="text-muted-foreground font-satoshi text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-center mb-16 italic">
                Descripción del evento pendiente por configurar.
              </p>
            )}
          </AnimatedContent>

          {/* Distance cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {distances && distances.length > 0 ? (
              distances.map((d, idx) => (
                <AnimatedContent key={d.id} delay={0.3 + idx * 0.1} distance={30}>
                  <Card className="bg-card border-border hover:border-ember/50 transition-colors group rounded-none h-full">
                    <CardContent className="p-8 text-center">
                      <Route className="w-10 h-10 text-ember mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-satoshi font-black text-3xl text-foreground mb-2 italic uppercase">{d.name}</h3>
                      <p className="text-sm text-muted-foreground font-satoshi">{d.label}</p>
                      {d.description && (
                        <p className="text-xs text-muted-foreground font-satoshi mt-2">{d.description}</p>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedContent>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Route className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-satoshi">
                  Las distancias serán configuradas por el organizador.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ruta */}
      <section id="ruta" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <AnimatedContent>
            <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
              La Ruta
            </h2>
          </AnimatedContent>

          {routeDescription && (
            <AnimatedContent delay={0.1} distance={20}>
              <p className="text-muted-foreground font-satoshi text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-center mb-12 leading-relaxed">
                {routeDescription}
              </p>
            </AnimatedContent>
          )}

          <div className="max-w-4xl mx-auto">
            <AnimatedContent delay={0.2} distance={50}>
              {routeMapUrl ? (
                <img src={routeMapUrl} alt="Mapa de la ruta" className="w-full rounded-none border border-border" />
              ) : (
                <div className="aspect-video bg-secondary rounded-none border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-satoshi">
                      Mapa de la ruta pendiente por cargar.
                    </p>
                  </div>
                </div>
              )}
            </AnimatedContent>

            {stravaUrl && (
              <AnimatedContent delay={0.4} distance={20}>
                <div className="mt-6 text-center">
                  <Button
                    variant="mechanical-outline"
                    asChild
                    className="border-ember text-ember hover:bg-ember hover:text-white transition-all bg-transparent"
                    style={{ boxShadow: '4px 4px 0px 0px hsl(14 78% 57%)' }}
                  >
                    <a href={stravaUrl} target="_blank" rel="noopener noreferrer">
                      Ver en Strava
                    </a>
                  </Button>
                </div>
              </AnimatedContent>
            )}

          </div>
        </div>
      </section>
    </>
  );
};


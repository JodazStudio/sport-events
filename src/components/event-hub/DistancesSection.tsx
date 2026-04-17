import { Route, Map } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import type { Distance } from "./types";

interface DistancesSectionProps {
  description?: string;
  distances?: Distance[];
  routeMapUrl?: string;
  stravaUrl?: string;
}

const DistancesSection = ({ description, distances, routeMapUrl, stravaUrl }: DistancesSectionProps) => {
  return (
    <>
      {/* Detalles */}
      <section id="detalles" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            Detalles del Evento
          </h2>

          {description ? (
            <p className="text-muted-foreground font-satoshi text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-center mb-16 leading-relaxed">
              {description}
            </p>
          ) : (
            <p className="text-muted-foreground font-satoshi text-base sm:text-lg md:text-xl max-w-3xl mx-auto text-center mb-16 italic">
              Descripción del evento pendiente por configurar.
            </p>
          )}

          {/* Distance cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {distances && distances.length > 0 ? (
              distances.map((d) => (
                <Card key={d.id} className="bg-card border-border hover:border-ember/50 transition-colors group rounded-none">
                  <CardContent className="p-8 text-center">
                    <Route className="w-10 h-10 text-ember mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="font-satoshi font-black text-3xl text-foreground mb-2 italic uppercase">{d.name}</h3>
                    <p className="text-sm text-muted-foreground font-satoshi">{d.label}</p>
                    {d.description && (
                      <p className="text-xs text-muted-foreground font-satoshi mt-2">{d.description}</p>
                    )}
                  </CardContent>
                </Card>
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
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            La Ruta
          </h2>

          <div className="max-w-4xl mx-auto">
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

            {stravaUrl && (
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  asChild
                  className="border-ember text-ember hover:bg-ember hover:text-ember-foreground font-satoshi rounded-none"
                >
                  <a href={stravaUrl} target="_blank" rel="noopener noreferrer">
                    Ver en Strava
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default DistancesSection;

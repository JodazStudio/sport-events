import { Calendar, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { eventService } from "@/features/events";
import { EventCard } from "@/components/events/EventCard";

export const EventsSection = async () => {
  const { data } = await eventService.getEvents({ limit: 2, onlyFilled: true });
  
  return (
    <section id="eventos" className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 border bg-card px-4 py-1.5">
              <span className="h-2 w-2 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Próximos Eventos
              </span>
            </div>
            <h2 className="font-satoshi text-4xl font-black text-foreground md:text-5xl">
              CALENDARIO <span className="text-primary">ACTUAL</span>
            </h2>
          </div>
          
          <Link
            href="/events"
            className="group flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            Ver calendario completo
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Event cards */}
        {data.events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-none max-w-4xl text-center px-6">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-satoshi text-xl font-bold uppercase italic text-muted-foreground">No hay eventos próximos</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs italic">
              Estamos preparando nuevas competencias. Vuelve pronto para descubrir los próximos retos.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
            {data.events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const EventsSkeleton = () => (
  <section id="eventos" className="py-24">
    <div className="mx-auto max-w-7xl px-4 lg:px-8">
      <div className="mb-16">
        <div className="mb-6 inline-flex items-center gap-2 border bg-card px-4 py-1.5">
          <span className="h-2 w-2 bg-primary" />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Próximos Eventos
          </span>
        </div>
        <h2 className="font-satoshi text-4xl font-black text-foreground md:text-5xl">
          CALENDARIO <span className="text-primary">ACTUAL</span>
        </h2>
      </div>
      
      <div className="flex items-center justify-center py-20 border-2 border-dashed border-muted rounded-none max-w-4xl">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
            Cargando calendario...
          </p>
        </div>
      </div>
    </div>
  </section>
);




import { MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { eventService } from "@/features/events";
import { formatDate } from "@/lib";

export const EventsSection = async () => {
  const events = await eventService.getEvents();

  return (
    <section id="eventos" className="py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
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

        {/* Event cards */}
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-muted rounded-none max-w-4xl text-center px-6">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-satoshi text-xl font-bold uppercase italic text-muted-foreground">No hay eventos próximos</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs italic">
              Estamos preparando nuevas competencias. Vuelve pronto para descubrir los próximos retos.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
            {events.map((event) => {
              const { day, month, year } = formatDate(event.event_date || event.created_at || "");
              const categoriesText = event.categories?.map((c) => c.name).join(" · ") || "Inscripciones Abiertas";
              
              return (
                <div
                  key={event.id}
                  className="group flex flex-col border bg-card transition-colors hover:border-primary"
                >
                  {/* Date header */}
                  <div className="flex items-center gap-4 border-b bg-muted px-6 py-4">
                    <div className="text-center">
                      <span className="font-mono text-3xl font-bold text-foreground">
                        {day}
                      </span>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                        {month} {year}
                      </div>
                    </div>
                    <Calendar className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-satoshi text-lg font-black uppercase text-foreground leading-tight">
                      {event.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      Venezuela
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-tight text-muted-foreground">
                      {categoriesText}
                    </div>

                    <Link
                      href={`/${event.slug}`}
                      className="btn-mechanical mt-6 bg-primary text-center text-primary-foreground flex items-center justify-center text-xs uppercase font-black"
                    >
                      Ver Evento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
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




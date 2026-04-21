'use client';

import { useState, useEffect } from "react";
import { MapPin, Calendar, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  date: string;
  name: string;
  location: string;
  categories: string;
}

interface EventsSectionProps {
  events?: Event[];
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("es-MX", { month: "short" }).toUpperCase().replace(".", "");
    const year = d.getFullYear();
    return { day, month, year };
  } catch (e) {
    return { day: "??", month: "???", year: "????" };
  }
}

export const EventsSection = ({ events: initialEvents = [] }: EventsSectionProps) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoading, setIsLoading] = useState(initialEvents.length === 0);

  useEffect(() => {
    // Only fetch if no initial events are provided
    if (initialEvents.length > 0) return;

    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error('Failed to fetch events');
        const result = await response.json();
        
        if (result.status === 'success' && Array.isArray(result.data)) {
          const mappedEvents = result.data.map((event: any) => ({
            id: event.slug || event.id,
            date: event.event_date || event.created_at,
            name: event.name,
            location: "Venezuela", // Default for now
            categories: event.categories?.map((c: any) => c.name).join(" · ") || "Inscripciones Abiertas",
          }));
          setEvents(mappedEvents);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [initialEvents]);

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
        {isLoading ? (
          <div className="flex items-center justify-center py-20 border-2 border-dashed border-muted rounded-none max-w-4xl">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
                Cargando calendario...
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
          {events.map((event, index) => {
            const { day, month, year } = formatDate(event.date);
            return (
              <div
                key={`${event.id}-${index}`}
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
                    {event.location}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-tight text-muted-foreground">
                    {event.categories}
                  </div>

                  <Link
                    href={`/${event.id}`}
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


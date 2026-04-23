import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib";
import { Event } from "@/features/events/schemas";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { day, month, year } = formatDate(event.event_date || event.created_at || "");
  const categoriesText = event.categories?.map((c) => c.name).join(" · ") || "Inscripciones Abiertas";
  
  return (
    <div className="group flex flex-col border bg-card transition-colors hover:border-primary">
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
          {event.city || "Venezuela"}
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
};

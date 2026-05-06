import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib";
import { Event } from "@/features/events/schemas";

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const { day, month, year } = formatDate(event.event_date || event.created_at || "");
  
  return (
    <div className="group flex flex-col border bg-card transition-colors hover:border-primary overflow-hidden">
      {/* Banner */}
      <div className="w-full h-48 bg-muted border-b">
        <img 
          src={event.banner_url || "/zonacrono_light.png"} 
          alt={event.name} 
          className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${event.banner_url ? 'object-cover' : 'object-contain p-8 dark:invert'}`} 
        />
      </div>

      {/* Header with Name and Date */}
      <div className="flex items-center justify-between gap-4 border-b bg-muted px-6 py-4">
        <h3 className="font-satoshi text-lg font-black uppercase text-foreground leading-tight max-w-[70%]">
          {event.name}
        </h3>
        <div className="text-right">
          <span className="font-mono text-2xl font-bold text-foreground block leading-none">
            {day}
          </span>
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
            {month} {year}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {event.city || "Venezuela"}
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

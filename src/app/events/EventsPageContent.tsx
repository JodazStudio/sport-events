"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { eventService } from "@/features/events";
import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Event } from "@/features/events/schemas";
import { Navbar, Footer } from "@/components/landing";

interface EventsPageContentProps {
  initialEvents: Event[];
  initialPagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  initialCities: string[];
  initialSearch: string;
  initialCity: string;
  initialPage: number;
}

export default function EventsPageContent({
  initialEvents,
  initialPagination,
  initialCities,
  initialSearch,
  initialCity,
  initialPage
}: EventsPageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);

  // Sync state with props if they change (e.g. via back button)
  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  const updateFilters = (newFilters: { search?: string; city?: string; page?: number }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilters.search !== undefined) {
      if (newFilters.search) params.set("search", newFilters.search);
      else params.delete("search");
      params.set("page", "1");
    }

    if (newFilters.city !== undefined) {
      if (newFilters.city && newFilters.city !== "all") params.set("city", newFilters.city);
      else params.delete("city");
      params.set("page", "1");
    }

    if (newFilters.page !== undefined) {
      params.set("page", newFilters.page.toString());
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounced search update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== initialSearch) {
        updateFilters({ search });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const loading = isPending;
  const events = initialEvents;
  const totalPages = initialPagination.totalPages;
  const totalEvents = initialPagination.total;
  const page = initialPage;
  const cities = initialCities;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="mb-2 inline-flex items-center gap-2 border bg-card px-4 py-1.5 w-fit">
              <span className="h-2 w-2 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Calendario Completo
              </span>
            </div>
            <h2 className="font-satoshi text-4xl font-black text-foreground md:text-5xl uppercase italic">
              ENCUENTRA TU <span className="text-primary">PRÓXIMO RETO</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre de evento..."
                className="pl-10 h-12 rounded-none border-2 focus-visible:ring-primary"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-64">
              <Select value={city} onValueChange={(val) => updateFilters({ city: val })}>
                <SelectTrigger className="h-12 rounded-none border-2 focus:ring-primary">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Todas las ciudades" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-none border-2">
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {loading ? "Buscando..." : `${totalEvents} eventos encontrados`}
          </p>
          <div className="flex items-center gap-2">
             <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Página {page} de {totalPages}
             </span>
          </div>
        </div>

        {/* Event List */}
        {loading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
              Cargando eventos...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="font-satoshi text-2xl font-black uppercase italic text-muted-foreground">No se encontraron eventos</h3>
            <p className="text-muted-foreground mt-2 max-w-xs text-center font-medium italic">
              Intenta ajustar tus filtros de búsqueda o vuelve más tarde.
            </p>
            <Button 
              variant="outline" 
              className="mt-8 rounded-none font-mono uppercase text-xs tracking-widest"
              onClick={() => {
                setSearch("");
                updateFilters({ search: "", city: "all", page: 1 });
              }}
            >
              Limpiar Filtros
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-none border-2 h-12 w-12 p-0 flex items-center justify-center transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
              onClick={() => updateFilters({ page: Math.max(1, page - 1) })}
              disabled={page === 1 || loading}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Show only current, first, last, and neighbors if many pages
                if (
                  totalPages > 5 &&
                  p !== 1 &&
                  p !== totalPages &&
                  Math.abs(p - page) > 1
                ) {
                  if (Math.abs(p - page) === 2) return <span key={p} className="flex items-end pb-2">...</span>;
                  return null;
                }

                return (
                  <Button
                    key={p}
                    variant={page === p ? "default" : "outline"}
                    className={`rounded-none border-2 h-12 w-12 font-mono transition-all ${
                      page === p ? "bg-primary text-primary-foreground border-primary" : "hover:border-primary hover:text-primary"
                    }`}
                    onClick={() => updateFilters({ page: p })}
                    disabled={loading}
                  >
                    {p}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              className="rounded-none border-2 h-12 w-12 p-0 flex items-center justify-center transition-all hover:bg-primary hover:text-primary-foreground disabled:opacity-30"
              onClick={() => updateFilters({ page: Math.min(totalPages, page + 1) })}
              disabled={page === totalPages || loading}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

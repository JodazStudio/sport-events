import { Metadata } from "next";
import EventsPageContent from "./EventsPageContent";
import { eventService } from "@/features/events";

export const metadata: Metadata = {
  title: "Eventos | Zonacrono",
  description: "Explora todos los eventos deportivos gestionados por Zonacrono. Carreras, triatlones, ciclismo y más.",
};

interface PageProps {
  searchParams: Promise<{ 
    search?: string; 
    city?: string; 
    page?: string 
  }>;
}

export default async function EventsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";
  const city = params.city || "all";

  // Fetch data in parallel on the server
  const [eventsResponse, cities] = await Promise.all([
    eventService.getEvents({
      page,
      limit: 8,
      search,
      city: city === "all" ? "" : city
    }),
    eventService.getCities()
  ]);

  return (
    <EventsPageContent 
      initialEvents={eventsResponse.data.events}
      initialPagination={eventsResponse.data.pagination}
      initialCities={cities}
      initialSearch={search}
      initialCity={city}
      initialPage={page}
    />
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { TenantData } from "@/types/tenant";
import EventHubTemplate from "@/components/event-hub/EventHubTemplate";
import { Loader2 } from 'lucide-react';

export default function EventPage() {
  const params = useParams();
  const eventSlug = params.event as string;
  
  const [data, setData] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bcvRate, setBcvRate] = useState(54.20);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventSlug) return;
      
      setIsLoading(true);
      try {
        // Fetch event data and exchange rate in parallel
        const [eventRes, rateRes] = await Promise.all([
          fetch(`/api/events?slug=${eventSlug}`),
          fetch("https://api.akomo.xyz/api/exchange-rates").catch(() => null)
        ]);

        if (eventRes.ok) {
          const result = await eventRes.json();
          const event = result.data;

          if (event) {
            // Map database event to TenantData structure (Client Side Mapping)
            const mappedData: TenantData = {
              id: event.slug,
              name: event.name,
              title: event.name,
              description: event.description || '',
              heroImage: event.banner_url || 'https://images.unsplash.com/photo-1530549387074-d76f964b3489?q=80&w=2072&auto=format&fit=crop',
              logo: '/logo.png',
              primaryColor: '#ff0000',
              registrationLink: `/${event.slug}/inscripciones`,
              eventDate: event.event_date,
              location: "Venezuela",
              pricingStages: event.registration_stages?.map((stage: any) => ({
                id: stage.id,
                name: stage.name,
                priceUsd: stage.price_usd,
                isActive: stage.is_active,
                spotsLeft: (stage.total_capacity || 0) - (stage.used_capacity || 0)
              })) || [],
              rules: event.rules_text ? [
                { id: 'rules', title: 'Reglamento', content: event.rules_text }
              ] : undefined,
              eventDetails: {
                route: {
                  title: "Ruta del Evento",
                  description: "Mapa oficial de la ruta.",
                  image: event.route_image_url || '',
                  stravaLinks: event.strava_url ? [{ label: "Segmento Strava", url: event.strava_url }] : []
                },
                categories: event.categories?.map((cat: any) => ({
                  name: cat.name,
                  range: cat.age_range || "Libre",
                  description: cat.description || ""
                })) || []
              },
              metadata: {
                keywords: ["deportes", "carrera", event.name.toLowerCase()],
                ogImage: event.banner_url || '',
                ogTitle: event.name,
                ogDescription: event.description || ''
              }
            };
            setData(mappedData);
          }
        }

        if (rateRes && rateRes.ok) {
          const rateJson = await rateRes.json();
          const rate = rateJson.rates?.find((r: any) => r.label === "USD");
          if (rate) setBcvRate(parseFloat(rate.value.replace(",", ".")));
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [eventSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Cargando Evento...
        </p>
      </div>
    );
  }

  if (!data) {
    return notFound();
  }

  return <EventHubTemplate tenant={data} bcvRate={bcvRate} />;
}

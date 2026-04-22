import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { eventService } from '@/features/events';
import { akomoService } from '@/features/akomo';
import { RegistrationForm } from '@/components/events/RegistrationForm';
import { Loader2, AlertCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface InscripcionPageProps {
  params: Promise<{ event: string }>;
}

/**
 * Generate dynamic metadata for the registration page
 */
export async function generateMetadata({ params }: InscripcionPageProps): Promise<Metadata> {
  const { event: slug } = await params;
  const event = await eventService.getEventBySlug(slug);

  if (!event) {
    return { title: 'Evento no encontrado | ZonaCrono' };
  }

  return {
    title: `Inscripción: ${event.name} | ZonaCrono`,
    description: `Inscríbete ahora en ${event.name}.`,
  };
}

/**
 * Loading state
 */
function LoadingState() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
        Cargando detalles del evento...
      </p>
    </div>
  );
}

/**
 * Server Component for the Registration Page
 */
export default async function InscripcionPage({ params }: InscripcionPageProps) {
  const { event: slug } = await params;
  
  // Fetch data in parallel on the server
  const [event, bcvRate] = await Promise.all([
    eventService.getEventBySlug(slug),
    akomoService.getExchangeRate()
  ]);

  if (!event) {
    return notFound();
  }

  // Find the active registration stage
  const activeStage = event.registration_stages?.find((stage: any) => stage.is_active);

  if (!activeStage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-black uppercase italic mb-2">Inscripciones Cerradas</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          No hay etapas de inscripción activas para <strong>{event.name}</strong> en este momento.
        </p>
        <Link href={`/${slug}`}>
          <Button variant="outline" className="rounded-none border-2 border-black font-bold uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            Volver al Evento
          </Button>
        </Link>
      </div>
    );
  }

  // Prepare minimal data for the client component to keep it serializable and efficient
  const clientEvent = {
    id: event.id,
    name: event.name,
    slug: event.slug,
    has_inventory: event.has_inventory,
    banner_url: event.banner_url || undefined,
    description: event.description || undefined,
    categories: event.categories || []
  };

  const clientStage = {
    id: activeStage.id,
    name: activeStage.name,
    price_usd: activeStage.price_usd,
    total_capacity: activeStage.total_capacity || 0,
    used_capacity: activeStage.used_capacity || 0
  };

  return (
    <Suspense fallback={<LoadingState />}>
      <RegistrationForm 
        event={clientEvent} 
        activeStage={clientStage} 
        bcvRate={bcvRate} 
        slug={slug} 
      />
    </Suspense>
  );
}

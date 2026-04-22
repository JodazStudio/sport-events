'use client';

import { use, useState } from 'react';
import { ConfigView } from '@/components/dashboard/config-view';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventConfigsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [eventData, setEventData] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/dashboard/events')}
          className="rounded-none border-2 border-transparent hover:border-black font-mono text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver a Eventos
        </Button>

        {eventData?.slug && (
          <Link href={`/${eventData.slug}`} target="_blank">
            <Button
              variant="outline"
              size="sm"
              className="rounded-none border-2 border-black font-black italic uppercase text-[10px] tracking-widest px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all gap-2"
            >
              <ExternalLink className="w-3 h-3" />
              Ver página del evento
            </Button>
          </Link>
        )}
      </div>

      <ConfigView 
        eventId={id} 
        isPage={true} 
        onLoaded={setEventData}
        onUpdate={() => {
          // No need to close modal here, just stay on page
        }}
        onDelete={() => {
          router.push('/dashboard/events');
        }}
      />
    </div>
  );
}

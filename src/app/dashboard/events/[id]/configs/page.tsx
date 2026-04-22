'use client';

import { use } from 'react';
import { ConfigView } from '@/components/dashboard/config-view';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventConfigsPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.push('/dashboard/events')}
          className="rounded-none border-2 border-transparent hover:border-black font-mono text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Volver a Eventos
        </Button>
      </div>

      <ConfigView 
        eventId={id} 
        isPage={true} 
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

'use client';

import { useState } from 'react';
import { PaymentsView } from "@/components/dashboard";
import { useAdminEvents } from "@/hooks/queries/useEvents";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, CreditCard } from "lucide-react";

export default function PaymentsPage() {
  const { data: adminData, isLoading } = useAdminEvents();
  const events = adminData?.events || [];
  
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Auto-select first event if none selected
  if (!selectedEventId && events.length > 0) {
    setSelectedEventId(events[0].id);
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="p-12 text-center border-2 border-dashed border-black">
        <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-black uppercase italic">No hay eventos activos</h3>
        <p className="text-muted-foreground">Crea un evento para comenzar a gestionar pagos.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-satoshi text-3xl font-black uppercase tracking-tight italic text-foreground">
           Control de <span className="text-primary">Pagos</span>
        </h1>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase font-black text-muted-foreground">Evento:</span>
          <Select 
            value={selectedEventId || ''} 
            onValueChange={setSelectedEventId}
          >
            <SelectTrigger className="w-[280px] rounded-none border-2 border-black font-bold uppercase italic text-xs">
              <SelectValue placeholder="Seleccionar evento" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {events.map((event: any) => (
                <SelectItem key={event.id} value={event.id} className="font-bold uppercase italic text-xs">
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedEventId && <PaymentsView eventId={selectedEventId} />}
    </div>
  );
}

'use client';

import { Search, Plus } from 'lucide-react';
import { Input, Button } from '@/components/ui';

interface EventsHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onProvisionClick: () => void;
}

export function EventsHeader({ search, onSearchChange, onProvisionClick }: EventsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="font-satoshi text-4xl font-black uppercase tracking-tight italic text-foreground">
          Eventos <span className="text-primary">Globales</span>
        </h1>
        <p className="text-muted-foreground font-medium italic">
          Panel maestro de control para todos los eventos de la plataforma.
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar evento..." 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-11 rounded-none border-2 border-black focus-visible:ring-primary/20 bg-white"
          />
        </div>
        
        <Button 
          onClick={onProvisionClick}
          className="h-11 rounded-none border-2 border-black bg-primary hover:bg-primary/90 text-white font-black italic uppercase text-xs tracking-widest px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Provision New
        </Button>
      </div>
    </div>
  );
}

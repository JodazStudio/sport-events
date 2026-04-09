"use client";

import { useState } from "react";
import { Search, Filter, ArrowUpRight, User, Calendar, Users, Settings } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Mock data for all events
const MOCK_EVENTS = [
  { id: "e1", name: "Maratón Santa Rosa 10K", organizer: "Juan Pérez", status: "public", registrations: 450, date: "2026-05-15" },
  { id: "e2", name: "Bici Race Carúpano", organizer: "María Rodríguez", status: "public", registrations: 125, date: "2026-06-20" },
  { id: "e3", name: "Triatlón de la Península", organizer: "Ana Martínez", status: "draft", registrations: 0, date: "2026-08-10" },
  { id: "e4", name: "Ciclismo de Montaña 2025", organizer: "Carlos López", status: "finished", registrations: 310, date: "2025-11-30" },
  { id: "e5", name: "Media Maratón El Tigre", organizer: "Juan Pérez", status: "public", registrations: 89, date: "2026-07-05" },
];

export default function GlobalEventsPage() {
  const startImpersonation = useAuthStore((state) => state.startImpersonation);
  const [search, setSearch] = useState("");

  const filteredEvents = MOCK_EVENTS.filter(event => 
    event.name.toLowerCase().includes(search.toLowerCase()) || 
    event.organizer.toLowerCase().includes(search.toLowerCase())
  );

  const handleManageEvent = (organizerId: string, eventName: string) => {
    // In this mockup, we use a fixed ID for the organizer
    const mockOrganizerId = "m1"; 
    startImpersonation(mockOrganizerId);
    toast.success("Accediendo al evento", {
      description: `Entrando como administrador para gestionar "${eventName}".`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "public":
        return <Badge className="bg-green-500 text-white rounded-none italic uppercase text-[9px] tracking-widest px-2">PÚBLICO</Badge>;
      case "draft":
        return <Badge variant="outline" className="border-2 rounded-none italic uppercase text-[9px] tracking-widest px-2">BORRADOR</Badge>;
      case "finished":
        return <Badge variant="secondary" className="rounded-none italic uppercase text-[9px] tracking-widest px-2">FINALIZADO</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-satoshi text-3xl font-black uppercase tracking-tight italic text-foreground">
            Eventos <span className="text-primary">Globales</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Panel maestro de todos los eventos registrados en la plataforma.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar evento u organizador..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-none border-2 focus-visible:ring-primary/20"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 border-2 rounded-none">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="bg-card border-2 border-border shadow-xl rounded-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Nombre del Evento</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Organizador</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Fecha</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Estado</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4 text-center">Inscritos</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4 text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id} className="border-b transition-colors hover:bg-muted/30">
                <TableCell className="font-bold py-4 italic text-sm group">
                  <div className="flex items-center gap-2">
                    {event.name}
                  </div>
                </TableCell>
                <TableCell className="py-4 font-medium text-muted-foreground">
                  <div className="flex items-center gap-2 italic">
                    <User className="h-3 w-3 text-primary" />
                    {event.organizer}
                  </div>
                </TableCell>
                <TableCell className="py-4 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {event.date}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  {getStatusBadge(event.status)}
                </TableCell>
                <TableCell className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 font-mono text-sm font-bold">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    {event.registrations}
                  </div>
                </TableCell>
                <TableCell className="py-4 text-right">
                  <Button 
                    onClick={() => handleManageEvent("m1", event.name)}
                    variant="ghost" 
                    size="sm" 
                    className="rounded-none font-mono text-[10px] uppercase tracking-widest gap-2 hover:bg-primary hover:text-white"
                  >
                    <Settings className="h-3 w-3" />
                    Gestionar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center font-medium text-muted-foreground">
                  No se encontraron eventos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats Summary for Superadmin */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Registros", value: "2,450", icon: Users },
          { label: "Eventos Activos", value: "24", icon: Globe },
          { label: "Ingresos Proyectados", value: "$12.4k", icon: ArrowUpRight },
          { label: "Tasa de Conversión", value: "18%", icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-card border-l-4 border-l-primary border-2 p-4 shadow-md group hover:translate-x-1 transition-transform cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-3 w-3 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-satoshi text-2xl font-black italic">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Fixed import for Globe and Activity
import { Globe, Activity } from "lucide-react";

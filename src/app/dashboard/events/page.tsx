'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui';
import { Button } from '@/components/ui';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, Input } from '@/components/ui';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { cn } from '@/lib';
import { FormInput, FormSelect } from '@/components/ui/forms';
import { ConfigView } from '@/components/dashboard/config-view';
import { useAdminEvents, useProvisionEvent } from '@/hooks/queries/useEvents';
import { 
  Plus, 
  ExternalLink, 
  Settings, 
  Trash2, 
  Loader2,
  Calendar,
  Clock,
  Search,
  Globe,
  Activity,
  Users,
  ArrowUpRight,
  MapPin,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useDashboardStats } from '@/hooks/queries/useDashboardStats';

interface Manager {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  name: string;
  slug: string;
  description: string;
  social_media?: any;
  event_date: string;
  event_time: string;
  manager_id: string;
  managers: Manager;
  created_at: string;
  status?: string;
}

export default function EventsPage() {
  const router = useRouter();
  
  // React Query Hooks
  const { data: adminData, isLoading: isEventsLoading } = useAdminEvents();
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();
  const provisionMutation = useProvisionEvent();
  const { role } = useAuthStore();
  
  const events = adminData?.events || [];
  const managers = adminData?.managers || [];
  
  // Local UI State
  const [search, setSearch] = useState("");
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  
  // Form State for Provisioning
  const eventSchema = z.object({
    manager_id: z.string().min(1, 'El organizador es requerido'),
    name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
    slug: z.string()
      .min(3, 'El slug debe tener al menos 3 caracteres')
      .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones'),
    event_date: z.string().min(1, 'La fecha es requerida'),
    event_time: z.string().min(1, 'La hora es requerida'),
  });

  type EventFormValues = z.infer<typeof eventSchema>;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      manager_id: '',
      name: '',
      slug: '',
      event_date: '',
      event_time: ''
    }
  });

  const { watch, setValue } = form;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'name') {
        setValue('slug', handleSlugify(value.name || ''), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const filteredEvents = events.filter((event: Event) => 
    event.name.toLowerCase().includes(search.toLowerCase()) || 
    event.managers?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleProvisionSubmit = async (values: EventFormValues) => {
    provisionMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Evento creado correctamente');
        setIsProvisionModalOpen(false);
        form.reset();
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al crear el evento');
      }
    });
  };


  const openConfigPage = (event: Event) => {
    router.push(`/dashboard/events/${event.id}/configs?tab=general`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-satoshi text-4xl font-black uppercase tracking-tight italic text-foreground">
            Gestión de <span className="text-primary">Eventos</span>
          </h1>
          <p className="text-muted-foreground font-medium italic">
            Panel de control para todos los eventos de la plataforma.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar evento..." 
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-none border-2 border-black focus-visible:ring-primary/20 bg-white"
            />
          </div>
          
          <Dialog open={isProvisionModalOpen} onOpenChange={setIsProvisionModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-none border-2 border-black bg-primary hover:bg-primary/90 text-white font-black italic uppercase text-xs tracking-widest px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Provision New
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-none border-4 border-black p-0 overflow-hidden">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProvisionSubmit)}>
                  <DialogHeader className="bg-black p-6 text-white">
                    <DialogTitle className="font-satoshi text-2xl font-black italic uppercase">Crear Evento</DialogTitle>
                    <DialogDescription className="font-medium italic text-gray-400">
                      Crea un nuevo evento y asígnalo a un organizador.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="p-6 space-y-6">
                    <FormSelect
                      control={form.control}
                      name="manager_id"
                      label="Organizador Responsable"
                      placeholder="Seleccionar organizador"
                      options={managers.map((m: Manager) => ({ value: m.id, label: m.name, email: m.email }))}
                    />
                    
                    <FormInput
                      control={form.control}
                      name="name"
                      label="Nombre del Evento"
                      placeholder="Ej. Maratón de la Ciudad"
                    />
                    
                    <FormInput
                      control={form.control}
                      name="slug"
                      label="Slug URL"
                      placeholder="maraton-ciudad"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        control={form.control}
                        name="event_date"
                        label="Fecha"
                        type="date"
                      />
                      <FormInput
                        control={form.control}
                        name="event_time"
                        label="Hora"
                        type="time"
                      />
                    </div>
                  </div>

                  <DialogFooter className="p-6 bg-muted/30 border-t-2 border-black/5">
                    <Button type="submit" disabled={provisionMutation.isPending} className="w-full rounded-none border-2 border-black bg-black text-white font-black italic uppercase py-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                      {provisionMutation.isPending ? <Loader2 className="animate-spin" /> : 'Confirmar Provisión'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {isStatsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted/20 animate-pulse border-2 border-dashed border-black/10 dark:border-white/10" />
          ))
        ) : (
          (role === 'superadmin' ? [
            { label: "Inscripciones Totales", value: statsData?.stats?.registrations_total || "0", icon: Users, color: "border-primary" },
            { label: "Eventos Totales", value: statsData?.stats?.events_total || "0", icon: Globe, color: "border-blue-500" },
            { label: "Estado de Sincronización", value: statsData?.stats?.sync_status || "OK", icon: Activity, color: "border-green-500" },
            { label: "Logs de Plataforma", value: "Activo", icon: Activity, color: "border-orange-500" },
          ] : [
            { label: "Recaudación Estimada", value: `$${(statsData?.stats?.revenue_estimated || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "border-green-600" },
            { label: "Inscripciones Totales", value: statsData?.stats?.registrations_total || "0", icon: Users, color: "border-primary" },
            { label: "Pagos Pendientes", value: statsData?.stats?.pending_payments || "0", icon: Clock, color: statsData?.stats?.pending_payments > 0 ? "border-destructive animate-pulse" : "border-muted" },
            { label: "Etapa Actual", value: statsData?.stats?.current_stage || "N/A", icon: MapPin, color: "border-orange-500" },
          ]).map((stat, i) => {
            const isComingSoon = stat.label === "Estado de Sincronización" || stat.label === "Logs de Plataforma" || stat.label === "Tasa de Conversión";
            
            return (
              <div key={i} className={`bg-card border-2 ${stat.color} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] group hover:translate-x-1 transition-transform relative overflow-hidden`}>
                {isComingSoon && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 border border-amber-500/20 rounded-none">
                    <AlertTriangle className="size-2" />
                    <span className="font-mono text-[7px] font-black uppercase tracking-widest">PRÓXIMAMENTE</span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div className={cn(
                  "font-satoshi text-3xl font-black italic uppercase tracking-tighter truncate",
                  isComingSoon && "blur-[2px] opacity-40 grayscale"
                )}>
                  {stat.value}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Main Table */}
      <div className="bg-card border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] rounded-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-b-2 border-black dark:border-white">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">Evento</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">URL</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">Organizador</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">Fecha / Hora</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isEventsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-b border-black/5">
                  <TableCell colSpan={5} className="py-6">
                    <div className="h-8 w-full bg-muted/20 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center font-medium italic text-muted-foreground">
                  No se encontraron eventos globales.
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event: Event) => (
                <TableRow key={event.id} className="hover:bg-muted/30 transition-colors border-b border-black/5 last:border-0">
                  <TableCell className="font-black italic text-lg py-5">{event.name}</TableCell>
                  <TableCell>
                    <Link 
                      href={`/${event.slug}`} 
                      target="_blank"
                      className="font-mono text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      /{event.slug}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold italic text-sm">{event.managers?.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{event.managers?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 font-mono text-[11px]">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1.5 text-primary" />
                        {format(new Date(event.event_date), 'dd MMM, yyyy', { locale: es })}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1.5 text-primary" />
                        {event.event_time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openConfigPage(event)}
                      className="h-10 w-10 p-0 hover:bg-black hover:text-white rounded-none border-2 border-transparent hover:border-black"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
}

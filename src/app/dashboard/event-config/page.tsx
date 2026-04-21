'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Loader2, 
  Save, 
  ImageIcon, 
  Settings, 
  Info, 
  Trash2, 
  Plus, 
  ChevronRight,
  Layout
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/useAuthStore';

// --- ZOD SCHEMA ---
const eventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'La fecha del evento es requerida'),
  event_time: z.string().min(1, 'La hora del evento es requerida'),
  rules_text: z.string().optional(),
  has_inventory: z.boolean(),
  banner_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  route_image_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  strava_url: z.string().url('URL inválida').or(z.literal('')).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface Event {
  id: string;
  name: string;
  slug: string;
}

export default function EventConfigPage() {
  const router = useRouter();
  const { session, impersonatedAdminId } = useAuthStore();
  
  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      event_date: '',
      event_time: '',
      rules_text: '',
      has_inventory: false,
      banner_url: '',
      route_image_url: '',
      strava_url: '',
    },
  });

  const eventName = useWatch({
    control: form.control,
    name: 'name',
  });

  // --- FETCH EVENTS LIST ---
  const fetchEvents = useCallback(async () => {
    if (!session?.access_token) return;
    
    setIsLoadingList(true);
    try {
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${session.access_token}`
      };
      if (impersonatedAdminId) headers['x-impersonate-id'] = impersonatedAdminId;

      const response = await fetch('/api/events', { headers });
      if (!response.ok) throw new Error('Error al cargar lista de eventos');
      
      const result = await response.json();
      const eventsData = result.data || [];
      setEvents(eventsData);
      
      // Auto-select the first event if none selected
      if (eventsData.length > 0 && !selectedEventId) {
        setSelectedEventId(eventsData[0].id);
      }
    } catch (error) {
      toast.error('No se pudo cargar la lista de eventos');
    } finally {
      setIsLoadingList(false);
    }
  }, [session, impersonatedAdminId, selectedEventId]);

  useEffect(() => {
    fetchEvents();
  }, [session, impersonatedAdminId]);

  // --- FETCH SINGLE EVENT DATA ---
  useEffect(() => {
    const fetchEventData = async () => {
      if (!selectedEventId || !session?.access_token) return;
      
      setIsLoadingEvent(true);
      try {
        const headers: Record<string, string> = {
          'Authorization': `Bearer ${session.access_token}`
        };
        if (impersonatedAdminId) headers['x-impersonate-id'] = impersonatedAdminId;

        const response = await fetch(`/api/events?id=${selectedEventId}`, { headers });
        if (!response.ok) throw new Error('Error al cargar datos del evento');
        
        const result = await response.json();
        const event = result.data;
        
        form.reset({
          id: event.id,
          name: event.name || '',
          slug: event.slug || '',
          description: event.description || '',
          event_date: event.event_date || '',
          event_time: event.event_time || '',
          rules_text: event.rules_text || '',
          has_inventory: !!event.has_inventory,
          banner_url: event.banner_url || '',
          route_image_url: event.route_image_url || '',
          strava_url: event.strava_url || '',
        });
        setIsManualSlug(true); // Don't auto-generate slug for existing events
      } catch (error) {
        toast.error('No se pudo cargar la configuración del evento');
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEventData();
  }, [selectedEventId, session, impersonatedAdminId, form]);

  // --- SLUG AUTO-GENERATION ---
  useEffect(() => {
    if (!isManualSlug && eventName) {
      const generatedSlug = eventName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [eventName, isManualSlug, form]);

  const onSubmit = async (values: EventFormValues) => {
    if (!session?.access_token) {
      toast.error('Sesión no válida');
      return;
    }

    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      };
      if (impersonatedAdminId) headers['x-impersonate-id'] = impersonatedAdminId;

      const method = values.id ? 'PUT' : 'POST';
      const response = await fetch('/api/events', {
        method,
        headers,
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || 'Error al guardar');

      toast.success(values.id ? 'Evento actualizado' : 'Evento creado');
      
      if (!values.id && result.data?.id) {
        setSelectedEventId(result.data.id);
        fetchEvents();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedEventId || !session?.access_token) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/events?id=${selectedEventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar');
      
      toast.success('Evento eliminado');
      setIsDeleteModalOpen(false);
      setSelectedEventId(null);
      fetchEvents();
    } catch (error) {
      toast.error('No se pudo eliminar el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedEventId(null);
    form.reset({
      name: '',
      slug: '',
      description: '',
      event_date: '',
      event_time: '',
      rules_text: '',
      has_inventory: false,
      banner_url: '',
      route_image_url: '',
      strava_url: '',
    });
    setIsManualSlug(false);
  };

  return (
    <div className="container mx-auto py-10 max-w-5xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-satoshi text-3xl font-black uppercase tracking-tight italic">
            Configuración <span className="text-primary">del Evento</span>
          </h1>
          <p className="text-muted-foreground italic font-medium">
            Personaliza los detalles, rutas y logística de tus eventos deportivos.
          </p>
        </div>
        
        <Button 
          onClick={handleCreateNew}
          className="rounded-none border-2 border-black bg-white text-black hover:bg-black hover:text-white font-bold italic uppercase text-xs tracking-widest gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Nuevo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Event List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-black text-white p-3 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
            <Layout className="w-3 h-3" />
            Mis Eventos
          </div>
          <div className="flex flex-col gap-2">
            {isLoadingList ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted/20 animate-pulse border-2 border-dashed" />
              ))
            ) : events.length === 0 ? (
              <p className="text-xs italic text-muted-foreground p-4 border-2 border-dashed text-center">
                No tienes eventos creados.
              </p>
            ) : (
              events.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEventId(e.id)}
                  className={`
                    flex items-center justify-between p-4 text-left transition-all border-2
                    ${selectedEventId === e.id 
                      ? 'border-black bg-primary/10 font-bold italic translate-x-1' 
                      : 'border-transparent hover:border-black/20 hover:bg-muted/30 italic text-muted-foreground'}
                  `}
                >
                  <span className="truncate text-sm">{e.name}</span>
                  {selectedEventId === e.id && <ChevronRight className="w-4 h-4 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-3">
          {isLoadingEvent ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                <Card className="border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="bg-muted/30 border-b-2 border-black">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        <CardTitle className="font-satoshi font-black italic uppercase text-xl">Información General</CardTitle>
                      </div>
                      {selectedEventId && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setIsDeleteModalOpen(true)}
                          className="text-destructive hover:bg-destructive hover:text-white rounded-none font-mono text-[9px] uppercase tracking-widest"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Eliminar Evento
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Nombre del Evento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Gran Fondo de Ciclismo" {...field} className="rounded-none border-2 border-black italic font-bold h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Slug (URL personalizada)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="ej-gran-fondo" 
                                {...field} 
                                onChange={(e) => {
                                  setIsManualSlug(true);
                                  field.onChange(e);
                                }}
                                className="rounded-none border-2 border-black font-mono h-11"
                              />
                            </FormControl>
                            <FormDescription className="italic text-[10px]">
                              zonacrono.com/{field.value || '...'}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="event_date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Fecha</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="rounded-none border-2 border-black h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="event_time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Hora Inicio</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} className="rounded-none border-2 border-black h-11" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Descripción Breve</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe de qué trata el evento..." 
                              className="resize-none min-h-[100px] rounded-none border-2 border-black italic"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SECCIÓN 2: MEDIA Y RUTA */}
                <Card className="border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="bg-muted/30 border-b-2 border-black">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <CardTitle className="font-satoshi font-black italic uppercase text-xl">Media y Ruta</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="banner_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest">URL del Banner Principal</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} className="rounded-none border-2 border-black h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="route_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">URL Mapa de Ruta</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="strava_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Segmento de Strava</FormLabel>
                            <FormControl>
                              <Input placeholder="https://strava.com/segments/..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* SECCIÓN 3: LOGÍSTICA Y REGLAMENTO */}
                <Card className="border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="bg-muted/30 border-b-2 border-black">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      <CardTitle className="font-satoshi font-black italic uppercase text-xl">Logística y Reglamento</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <FormField
                      control={form.control}
                      name="has_inventory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-none border-2 border-black p-6 shadow-inner bg-muted/10">
                          <div className="space-y-0.5">
                            <FormLabel className="font-bold italic uppercase text-sm">Gestionar Tallas</FormLabel>
                            <FormDescription className="italic text-xs">
                              Solicitar talla de camisa durante el registro.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rules_text"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Reglamento y Políticas</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Reglamento del evento, políticas de reembolso, etc." 
                              className="resize-none min-h-[150px] rounded-none border-2 border-black italic"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4 pb-20">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-black hover:bg-primary text-white px-12 py-7 rounded-none border-4 border-black font-black italic uppercase text-lg tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-3 h-6 w-6" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-destructive shadow-[8px_8px_0px_0px_rgba(239,68,68,0.2)]">
          <DialogHeader>
            <DialogTitle className="font-satoshi font-black italic uppercase text-destructive text-2xl text-center">¡Atención!</DialogTitle>
            <DialogDescription className="text-center italic font-medium">
              ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-sm font-bold italic">Se perderán todos los datos configurados.</p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button type="button" variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="rounded-none border-2 border-black italic font-bold">
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isSubmitting}
              className="rounded-none font-black italic uppercase"
            >
              Sí, Eliminar Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

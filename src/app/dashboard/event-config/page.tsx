'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/sonner';
import { Loader2, Save, MapPin, ImageIcon, Settings, Info } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuthStore } from '@/store/useAuthStore';

// --- ZOD SCHEMA ---
const eventSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .regex(/^[a-z0-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones')
    .transform(val => val.toLowerCase()),
  description: z.string().optional(),
  event_date: z.string().min(1, 'La fecha del evento es requerida'),
  event_time: z.string().min(1, 'La hora del evento es requerida'),
  rules_text: z.string().optional(),
  has_inventory: z.boolean().default(false),
  banner_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  route_image_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  strava_url: z.string().url('URL inválida').or(z.literal('')).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EventConfigPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isManualSlug, setIsManualSlug] = useState(false);

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
      toast.error('Sesión no válida. Por favor inicia sesión de nuevo.');
      return;
    }

    setIsSubmitting(true);
    try {
      const method = values.id ? 'PUT' : 'POST';
      const response = await fetch('/api/events', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al guardar el evento');
      }

      toast.success(values.id ? 'Evento actualizado con éxito' : 'Evento creado con éxito');
      
      // If new, update form with returned ID to allow further editing
      if (!values.id && result.data?.id) {
        form.setValue('id', result.data.id);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'Error al guardar el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Configuración del Evento</h1>
        <p className="text-muted-foreground italic">
          Configura los detalles generales, rutas y logística de tu evento deportivo.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <CardTitle>Información General</CardTitle>
              </div>
              <CardDescription>Detalles básicos que identificarán tu evento.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Gran Fondo de Ciclismo" {...field} />
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
                      <FormLabel>Slug (URL personalizada)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ej-gran-fondo" 
                          {...field} 
                          onChange={(e) => {
                            setIsManualSlug(true);
                            field.onChange(e);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        zonacrono.com/nombre-de-tu-evento
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
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                        <FormLabel>Hora Inicio</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
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
                    <FormLabel>Descripción Breve</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe de qué trata el evento..." 
                        className="resize-none min-h-[100px]"
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
          <Card className="border-secondary/20 shadow-lg">
            <CardHeader className="bg-secondary/5">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-secondary" />
                <CardTitle>Media y Ruta</CardTitle>
              </div>
              <CardDescription>Enlaces a imágenes y segmentos de ruta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="banner_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del Banner Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Imagen principal que aparecerá en la cabecera. (Próximamente: Carga de archivos).
                    </FormDescription>
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
                      <FormLabel>URL Mapa de Ruta</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
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
                      <FormLabel>Segmento de Strava</FormLabel>
                      <FormControl>
                        <Input placeholder="https://strava.com/segments/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* SECCIÓN 3: LOGÍSTICA Y REGLAMENTO */}
          <Card className="border-accent/20 shadow-lg">
            <CardHeader className="bg-accent/5">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-accent" />
                <CardTitle>Logística y Reglamento</CardTitle>
              </div>
              <CardDescription>Opciones adicionales y términos legales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField
                control={form.control}
                name="has_inventory"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Gestionar Tallas</FormLabel>
                      <FormDescription>
                        Solicitar talla de camisa durante el registro.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
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
                    <FormLabel>Reglamento y Políticas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Escribe aquí el reglamento del evento, políticas de reembolso, etc." 
                        className="resize-none min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end pt-6">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Guardar Configuración
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </div>
  );
}

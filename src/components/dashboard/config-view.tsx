"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Layers, 
  Tag,
  Settings,
  Info,
  Save,
  Loader2,
  ImageIcon,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryManagement } from "./category-management";

// --- ZOD SCHEMA ---
const configSchema = z.object({
  id: z.string().optional(),
  manager_id: z.string().min(1, 'El organizador es requerido'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string()
    .min(3, 'El slug debe tener al menos 3 caracteres')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minúsculas, números y guiones'),
  description: z.string().optional(),
  event_date: z.string().min(1, 'La fecha es requerida'),
  event_time: z.string().min(1, 'La hora es requerida'),
  rules_text: z.string().optional(),
  has_inventory: z.boolean(),
  banner_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  route_image_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  strava_url: z.string().url('URL inválida').or(z.literal('')).optional(),
  social_media: z.object({
    instagram: z.string().url('URL inválida').or(z.literal('')).optional(),
    facebook: z.string().url('URL inválida').or(z.literal('')).optional(),
    twitter: z.string().url('URL inválida').or(z.literal('')).optional(),
    threads: z.string().url('URL inválida').or(z.literal('')).optional(),
    tiktok: z.string().url('URL inválida').or(z.literal('')).optional(),
  }).optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

const stages = [
  { id: 1, name: "Preventa 1", price: "25.00", capacity: 100, active: true },
  { id: 2, name: "Fase 2", price: "35.00", capacity: 200, active: false },
  { id: 3, name: "Último Llamado", price: "45.00", capacity: 200, active: false },
];

interface ConfigViewProps {
  eventId: string;
  onDelete?: () => void;
  onUpdate?: () => void;
  isPage?: boolean;
}

interface Manager {
  id: string;
  name: string;
  email: string;
}

export function ConfigView({ eventId, onDelete, onUpdate, isPage = false }: ConfigViewProps) {
  const { session } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "general");

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      manager_id: '',
      name: '',
      slug: '',
      event_date: '',
      event_time: '',
      description: '',
      rules_text: '',
      has_inventory: false,
      banner_url: '',
      route_image_url: '',
      strava_url: '',
      social_media: {
        instagram: '',
        facebook: '',
        twitter: '',
        threads: '',
        tiktok: '',
      }
    },
  });

  const fetchData = async () => {
    if (!session?.access_token) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/events', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await response.json();
      setManagers(data.managers || []);
      
      const event = data.events?.find((e: any) => e.id === eventId || e.slug === eventId);
      if (event) {
        form.reset({
          id: event.id,
          manager_id: event.manager_id,
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
          social_media: event.social_media || {
            instagram: '',
            facebook: '',
            twitter: '',
            threads: '',
            tiktok: '',
          }
        });
      }
    } catch (error) {
      toast.error("Error al cargar configuración");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [eventId, session]);

  // Sync tab with URL if isPage
  useEffect(() => {
    if (isPage) {
      const tab = searchParams.get("tab");
      if (tab) setActiveTab(tab);
    }
  }, [searchParams, isPage]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.push(`?${params.toString()}`);
    }
  };

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const onSubmit = async (values: ConfigFormValues) => {
    if (!session?.access_token) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(values)
      });
      
      if (!response.ok) throw new Error('Error al actualizar');
      
      toast.success('Configuración actualizada');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="font-mono text-sm uppercase font-black">Cargando configuración...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2">
            Configuración del <span className="text-primary">Evento</span>
          </h2>
          <p className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-wider">
            Gestiona información general, etapas de inscripción y categorías
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="bg-muted p-1 rounded-none border-2 border-black h-auto mb-8 grid grid-cols-2 lg:grid-cols-4 lg:inline-flex">
          <TabsTrigger value="general" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Info className="mr-2 size-4 hidden sm:inline" />
            General
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <ImageIcon className="mr-2 size-4 hidden sm:inline" />
            Media
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Tag className="mr-2 size-4 hidden sm:inline" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="stages" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Layers className="mr-2 size-4 hidden sm:inline" />
            Etapas
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general" className="space-y-8">
              <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-muted/30 border-b-2 border-black">
                  <CardTitle className="font-satoshi font-black italic uppercase text-xl">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="manager_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Organizador / Dueño</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-2 border-black h-11 font-bold italic">
                              <SelectValue placeholder="Seleccionar organizador" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-none border-2 border-black">
                            {managers.map((m) => (
                              <SelectItem key={m.id} value={m.id} className="font-medium italic">
                                {m.name} ({m.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Nombre del Evento</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e);
                              const slug = handleSlugify(e.target.value);
                              form.setValue('slug', slug, { shouldValidate: true });
                            }}
                            className="rounded-none border-2 border-black italic font-bold h-11" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Slug URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-none border-2 border-black font-mono text-sm h-11" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
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
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Hora</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} className="rounded-none border-2 border-black h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Descripción</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="rounded-none border-2 border-black italic min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-8">
              <Card className="border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="bg-muted/30 border-b-2 border-black">
                  <CardTitle className="font-satoshi font-black italic uppercase text-xl">Media y Ruta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <FormField
                    control={form.control}
                    name="banner_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest">URL del Banner</FormLabel>
                        <FormControl>
                          <Input {...field} className="rounded-none border-2 border-black h-11" />
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
                            <Input {...field} className="rounded-none border-2 border-black h-11" />
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
                          <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Link de Strava</FormLabel>
                          <FormControl>
                            <Input {...field} className="rounded-none border-2 border-black h-11" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="pt-4 border-t-2 border-black/5 space-y-6">
                    <h3 className="font-black italic uppercase text-lg">Redes Sociales</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="social_media.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Instagram URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://instagram.com/..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="social_media.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Facebook URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social_media.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">X (Twitter) URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://x.com/..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social_media.threads"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Threads URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://threads.net/..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social_media.tiktok"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[10px] uppercase tracking-widest">TikTok URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://tiktok.com/@..." {...field} className="rounded-none border-2 border-black h-11" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="has_inventory"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-none border-2 border-black p-4 shadow-inner bg-muted/10">
                        <div className="space-y-0.5">
                          <FormLabel className="font-bold italic uppercase text-sm">Gestionar Inventario (Tallas)</FormLabel>
                          <FormDescription className="italic text-xs">Solicitar talla durante el registro.</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-primary" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rules_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[10px] uppercase tracking-widest">Reglamento</FormLabel>
                        <FormControl>
                          <Textarea {...field} className="rounded-none border-2 border-black italic min-h-[150px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sticky/Fixed Actions Bar for General/Media tabs */}
            {(activeTab === 'general' || activeTab === 'media') && (
              <div className="flex items-center justify-between gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={onDelete}
                  className="rounded-none border-2 border-black font-black uppercase italic tracking-widest py-6 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Eliminar Evento
                </Button>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-none border-2 border-black bg-black text-white font-black uppercase italic tracking-widest py-6 px-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Guardar Cambios
                </Button>
              </div>
            )}
          </form>
        </Form>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement eventId={form.getValues('id') || eventId} />
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 border-2 border-dashed border-black gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground text-balance">Precio Activo: Preventa 1</span>
            </div>
            <Button className="rounded-none border-2 border-black bg-primary hover:bg-primary/90 text-white font-black italic uppercase text-xs tracking-widest px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
               <Plus className="mr-2 h-4 w-4" /> Nueva Etapa
            </Button>
          </div>

          <div className="border-2 border-black bg-white overflow-x-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="bg-muted/50 border-b-2 border-black">
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Nombre</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Precio (USD)</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Capacidad</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Estado</TableHead>
                    <TableHead className="text-right py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stages.map((stage) => (
                    <TableRow key={stage.id} className="border-b border-black/10 hover:bg-muted/30 transition-colors">
                      <TableCell className="font-black italic uppercase tracking-tight py-4">{stage.name}</TableCell>
                      <TableCell className="font-mono font-bold py-4">${stage.price}</TableCell>
                      <TableCell className="font-mono py-4 text-muted-foreground">{stage.capacity} PAX</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-2">
                          <Switch checked={stage.active} className="data-[state=checked]:bg-primary" />
                          <span className={`font-mono text-[9px] uppercase font-bold ${stage.active ? "text-primary" : "text-muted-foreground"}`}>
                            {stage.active ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-black hover:text-white rounded-none">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <DropdownMenuItem className="cursor-pointer font-bold italic uppercase text-xs">
                              <Edit2 className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-black/10" />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive font-bold italic uppercase text-xs">
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

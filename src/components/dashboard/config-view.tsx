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
  Activity,
  CreditCard,
  User
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
import { 
  Form, 
} from "../ui/form";
import { FormInput, FormTextarea, FormSelect, FormSwitch } from "@/components/ui/forms";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { useAuthStore } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryManagement } from "./category-management";
import { StageManagement } from "./stage-management";
import { RegistrationManagement } from "./registration-management";

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
  payment_info: z.object({
    bank_name: z.string().min(1, 'El nombre del banco es requerido').or(z.literal('')),
    account_number: z.string().min(1, 'El número de cuenta es requerido').or(z.literal('')),
    id_number: z.string().min(1, 'La cédula/RIF es requerida').or(z.literal('')),
    phone_number: z.string().min(1, 'El número de teléfono es requerido').or(z.literal('')),
  }).optional(),
});

type ConfigFormValues = z.infer<typeof configSchema>;

// Removed hardcoded stages

interface ConfigViewProps {
  eventId: string;
  onDelete?: () => void;
  onUpdate?: () => void;
  onLoaded?: (event: any) => void;
  isPage?: boolean;
}

interface Manager {
  id: string;
  name: string;
  email: string;
}

export function ConfigView({ eventId, onDelete, onUpdate, onLoaded, isPage = false }: ConfigViewProps) {
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
      },
      payment_info: {
        bank_name: '',
        account_number: '',
        id_number: '',
        phone_number: '',
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
        if (onLoaded) onLoaded(event);
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
          },
          payment_info: event.payment_info || {
            bank_name: '',
            account_number: '',
            id_number: '',
            phone_number: '',
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
        <TabsList className="bg-muted p-1 rounded-none border-2 border-black dark:border-white h-auto mb-8 grid grid-cols-2 lg:grid-cols-4 lg:inline-flex">
          <TabsTrigger value="general" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Info className="mr-2 size-4 hidden sm:inline" />
            General
          </TabsTrigger>
          <TabsTrigger value="media" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <ImageIcon className="mr-2 size-4 hidden sm:inline" />
            Media
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Tag className="mr-2 size-4 hidden sm:inline" />
            Categorías
          </TabsTrigger>
          <TabsTrigger value="stages" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Layers className="mr-2 size-4 hidden sm:inline" />
            Etapas
          </TabsTrigger>
          <TabsTrigger value="registrations" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <User className="mr-2 size-4 hidden sm:inline" />
            Inscritos
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-none data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <CreditCard className="mr-2 size-4 hidden sm:inline" />
            Pagos
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <TabsContent value="general" className="space-y-8">
              <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
                <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
                  <CardTitle className="font-satoshi font-black italic uppercase text-xl">Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <FormSelect
                    control={form.control}
                    name="manager_id"
                    label="Organizador / Dueño"
                    placeholder="Seleccionar organizador"
                    options={managers.map(m => ({ value: m.id, label: m.name, email: m.email }))}
                  />

                  <FormInput
                    control={form.control}
                    name="name"
                    label="Nombre del Evento"
                    onChange={(e) => {
                      const slug = handleSlugify(e.target.value);
                      form.setValue('slug', slug, { shouldValidate: true });
                    }}
                  />

                  <FormInput
                    control={form.control}
                    name="slug"
                    label="Slug URL"
                    inputClassName="font-mono text-sm"
                  />

                  <div className="grid grid-cols-2 gap-6">
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

                  <FormTextarea
                    control={form.control}
                    name="description"
                    label="Descripción"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-8">
              <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
                <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
                  <CardTitle className="font-satoshi font-black italic uppercase text-xl">Media y Ruta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <FormInput
                    control={form.control}
                    name="banner_url"
                    label="URL del Banner"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      control={form.control}
                      name="route_image_url"
                      label="URL Mapa de Ruta"
                    />
                    <FormInput
                      control={form.control}
                      name="strava_url"
                      label="Link de Strava"
                    />
                  </div>

                  <div className="pt-4 border-t-2 border-black/5 space-y-6">
                    <h3 className="font-black italic uppercase text-lg text-primary">Redes Sociales</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormInput
                        control={form.control}
                        name="social_media.instagram"
                        label="Instagram URL"
                        placeholder="https://instagram.com/..."
                      />
                      
                      <FormInput
                        control={form.control}
                        name="social_media.facebook"
                        label="Facebook URL"
                        placeholder="https://facebook.com/..."
                      />

                      <FormInput
                        control={form.control}
                        name="social_media.twitter"
                        label="X (Twitter) URL"
                        placeholder="https://x.com/..."
                      />

                      <FormInput
                        control={form.control}
                        name="social_media.threads"
                        label="Threads URL"
                        placeholder="https://threads.net/..."
                      />

                      <FormInput
                        control={form.control}
                        name="social_media.tiktok"
                        label="TikTok URL"
                        placeholder="https://tiktok.com/@..."
                      />
                    </div>
                  </div>

                  <FormSwitch
                    control={form.control}
                    name="has_inventory"
                    label="Gestionar Inventario (Tallas)"
                    description="Solicitar talla durante el registro."
                  />

                  <FormTextarea
                    control={form.control}
                    name="rules_text"
                    label="Reglamento"
                    className="min-h-[150px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sticky/Fixed Actions Bar for General/Media/Payments tabs */}
            {(activeTab === 'general' || activeTab === 'media' || activeTab === 'payments') && (
              <div className="flex items-center justify-between gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={onDelete}
                  className="rounded-none border-2 border-black dark:border-white font-black uppercase italic tracking-widest py-6 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Eliminar Evento
                </Button>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-none border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest py-6 px-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Guardar Cambios
                </Button>
              </div>
            )}
            <TabsContent value="payments" className="space-y-8">
              <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
                <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
                  <CardTitle className="font-satoshi font-black italic uppercase text-xl">Datos Bancarios para Inscripciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <p className="text-xs font-mono text-muted-foreground uppercase mb-4">
                    Estos datos se mostrarán a los atletas durante el proceso de pago.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                      control={form.control}
                      name="payment_info.bank_name"
                      label="Nombre del Banco"
                      placeholder="Ej: Bancamiga"
                    />
                    <FormInput
                      control={form.control}
                      name="payment_info.phone_number"
                      label="Número de Teléfono (Pago Móvil)"
                      placeholder="Ej: 0424-0000000"
                    />
                    <FormInput
                      control={form.control}
                      name="payment_info.id_number"
                      label="Cédula / RIF"
                      placeholder="Ej: V-12345678"
                    />
                    <FormInput
                      control={form.control}
                      name="payment_info.account_number"
                      label="Número de Cuenta (Opcional)"
                      placeholder="0123..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>

        <TabsContent value="categories" className="space-y-6">
          <CategoryManagement eventId={form.getValues('id') || eventId} />
        </TabsContent>

        <TabsContent value="stages" className="space-y-6">
          <StageManagement eventId={form.getValues('id') || eventId} />
        </TabsContent>

        <TabsContent value="registrations" className="space-y-6">
          <RegistrationManagement eventId={form.getValues('id') || eventId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

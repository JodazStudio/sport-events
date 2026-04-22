'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  User,
  Activity,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

import { 
  Button, 
  Input, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from '@/components/ui';
import { useAuthStore } from '@/store';
import { checkAgeOverlap } from '@/features/events/utils';

// --- SCHEMAS ---

const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  gender: z.enum(['MALE', 'FEMALE', 'MIXED']),
  min_age: z.coerce.number().min(0, 'Edad mínima requerida'),
  max_age: z.coerce.number().min(0, 'Edad máxima requerida'),
}).refine(data => data.max_age >= data.min_age, {
  message: "La edad máxima debe ser mayor o igual a la mínima",
  path: ["max_age"],
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface Category {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'MIXED';
  min_age: number;
  max_age: number;
}

interface CategoryManagementProps {
  eventId: string;
}

export function CategoryManagement({ eventId }: CategoryManagementProps) {
  const { session } = useAuthStore();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: '',
      gender: 'MALE',
      min_age: 10,
      max_age: 99,
    },
  });

  // Load categories
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/categories?event_id=${eventId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      setCategories(result.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar categorías');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchCategories();
  }, [eventId]);

  // Handlers
  const handleOpenAdd = () => {
    setSelectedCategory(null);
    form.reset({
      name: '',
      gender: 'MALE',
      min_age: 0,
      max_age: 99,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setSelectedCategory(category);
    form.reset({
      name: category.name,
      gender: category.gender,
      min_age: category.min_age,
      max_age: category.max_age,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (values: CategoryFormValues) => {
    if (!session?.access_token) return;

    // Client-side overlap validation
    const hasOverlap = checkAgeOverlap(
      { 
        id: selectedCategory?.id, 
        gender: values.gender, 
        min_age: values.min_age, 
        max_age: values.max_age 
      },
      categories
    );

    if (hasOverlap) {
      toast.error('Solapamiento detectado', {
        description: 'Ya existe una categoría con este género y rango de edad.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const method = selectedCategory ? 'PUT' : 'POST';
      const body = {
        ...values,
        id: selectedCategory?.id,
        event_id: eventId,
      };

      const response = await fetch('/api/categories', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar categoría');
      }

      toast.success(selectedCategory ? 'Categoría actualizada' : 'Categoría creada');
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (!session?.access_token || !selectedCategory) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/categories?id=${selectedCategory.id}&event_id=${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar');

      toast.success('Categoría eliminada');
      setIsDeleteModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error('Error al eliminar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Helpers
  const getGenderBadge = (gender: string) => {
    switch (gender) {
      case 'MALE':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 rounded-none font-mono text-[10px] uppercase">Masculino</Badge>;
      case 'FEMALE':
        return <Badge className="bg-pink-100 text-pink-700 border-pink-200 rounded-none font-mono text-[10px] uppercase">Femenino</Badge>;
      default:
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200 rounded-none font-mono text-[10px] uppercase">Mixto</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Gestión de Categorías
          </h2>
          <p className="text-sm text-muted-foreground font-mono">Define los rangos de edad y géneros para la competencia.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="rounded-none border-2 border-black bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="border-2 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-mono text-sm uppercase font-black animate-pulse">Cargando categorías...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 bg-muted border-2 border-dashed border-black flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black uppercase tracking-tight">No hay categorías configuradas</p>
              <p className="text-sm text-muted-foreground font-mono">Comienza creando la primera categoría para el evento.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-white font-mono uppercase font-black text-[10px] tracking-widest h-12">Categoría</TableHead>
                  <TableHead className="text-white font-mono uppercase font-black text-[10px] tracking-widest h-12">Género</TableHead>
                  <TableHead className="text-white font-mono uppercase font-black text-[10px] tracking-widest h-12 text-center">Edad</TableHead>
                  <TableHead className="text-white font-mono uppercase font-black text-[10px] tracking-widest h-12 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 border-b-2 border-black/10">
                    <TableCell className="font-bold py-4">
                      <div className="flex flex-col">
                        <span className="uppercase tracking-tight">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getGenderBadge(category.gender)}</TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">{category.min_age}</span>
                        <span className="text-xs text-muted-foreground">-</span>
                        <span className="bg-black text-white px-1.5 py-0.5 text-[10px]">{category.max_age}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(category)}
                          className="rounded-none border-2 border-transparent hover:border-black hover:bg-white transition-all h-8 w-8"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(category)}
                          className="rounded-none border-2 border-transparent hover:border-black hover:bg-destructive/10 hover:text-destructive transition-all h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* CATEGORY FORM DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-none border-4 border-black p-0 overflow-hidden max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <DialogHeader className="bg-black p-6">
            <DialogTitle className="text-white font-black uppercase tracking-widest flex items-center gap-2">
              {selectedCategory ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-mono text-xs">
              Configura los detalles de la categoría para el evento.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="p-6 space-y-6">
              <FormField<CategoryFormValues>
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-mono text-[10px] uppercase tracking-widest font-black">Nombre de la Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Master A Masculino" {...field} className="rounded-none border-2 border-black italic font-bold h-11" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField<CategoryFormValues>
                  control={form.control as any}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-mono text-[10px] uppercase tracking-widest font-black">Género</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                        <FormControl>
                          <SelectTrigger className="rounded-none border-2 border-black h-11 font-bold italic">
                            <SelectValue placeholder="Selecciona género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                          <SelectItem value="MALE">Masculino</SelectItem>
                          <SelectItem value="FEMALE">Femenino</SelectItem>
                          <SelectItem value="MIXED">Mixto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>

              <div className="bg-muted/30 p-4 border-2 border-dashed border-black space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-[9px] uppercase font-black">Rango de Edad</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField<CategoryFormValues>
                    control={form.control as any}
                    name="min_age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[9px] uppercase tracking-tight">Edad Mínima</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-none border-2 border-black h-10 font-mono font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField<CategoryFormValues>
                    control={form.control as any}
                    name="max_age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-mono text-[9px] uppercase tracking-tight">Edad Máxima</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="rounded-none border-2 border-black h-10 font-mono font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-none border-2 border-transparent hover:border-black font-bold uppercase text-xs"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-none border-2 border-black bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all px-8"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {selectedCategory ? 'Actualizar' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-none border-4 border-black p-0 overflow-hidden max-w-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
          <div className="bg-destructive p-6 flex flex-col items-center text-center text-white gap-4">
            <XCircle className="w-12 h-12" />
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">¿Eliminar categoría?</DialogTitle>
              <p className="text-xs font-mono opacity-90 mt-1">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-sm font-bold text-center">
              Estás a punto de eliminar la categoría <span className="underline italic">"{selectedCategory?.name}"</span>.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-none border-2 border-black font-black uppercase tracking-widest hover:bg-muted"
              >
                No, volver
              </Button>
              <Button 
                variant="destructive"
                onClick={onDelete}
                disabled={isSubmitting}
                className="rounded-none border-2 border-black bg-destructive text-destructive-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sí, eliminar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

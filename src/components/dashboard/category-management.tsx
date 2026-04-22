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
  Users,
  Copy,
  CheckSquare,
  Square
} from 'lucide-react';
import { toast } from 'sonner';

import { 
  Button, 
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
  Badge,
  Checkbox,
} from '@/components/ui';
import { FormInput, FormSelect } from '@/components/ui/forms';
import { useAuthStore } from '@/store';
import { checkAgeOverlap } from '@/features/events/utils';
import { useCategories, useMutationCategory } from '@/hooks/queries/useCategories';

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
  // React Query Hooks
  const { data: categories = [], isLoading } = useCategories(eventId);
  const categoryMutation = useMutationCategory();
  
  // State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [duplicateTargetGender, setDuplicateTargetGender] = useState<'MALE' | 'FEMALE' | 'MIXED'>('FEMALE');

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema) as any,
    defaultValues: {
      name: '',
      gender: 'MALE',
      min_age: 10,
      max_age: 99,
    },
  });

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

    const method = selectedCategory ? 'PUT' : 'POST';
    categoryMutation.mutate({
      method,
      body: {
        ...values,
        id: selectedCategory?.id,
        event_id: eventId,
      }
    }, {
      onSuccess: () => {
        toast.success(selectedCategory ? 'Categoría actualizada' : 'Categoría creada');
        setIsDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al procesar categoría');
      }
    });
  };

  const onDelete = async () => {
    if (!selectedCategory) return;

    categoryMutation.mutate({
      method: 'DELETE',
      body: {
        id: selectedCategory.id,
        event_id: eventId,
      }
    }, {
      onSuccess: () => {
        toast.success('Categoría eliminada');
        setIsDeleteModalOpen(false);
      },
      onError: () => {
        toast.error('Error al eliminar categoría');
      }
    });
  };

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === categories.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(categories.map((c: Category) => c.id)));
    }
  };

  const onDuplicate = async () => {
    if (selectedIds.size === 0) return;

    const categoriesToDuplicate = categories.filter((c: Category) => selectedIds.has(c.id));
    const newCategories = categoriesToDuplicate.map((c: Category) => ({
      event_id: eventId,
      name: c.name,
      gender: duplicateTargetGender,
      min_age: c.min_age,
      max_age: c.max_age
    }));

    categoryMutation.mutate({
      method: 'POST',
      body: newCategories
    }, {
      onSuccess: () => {
        toast.success(`${selectedIds.size} categorías duplicadas a ${duplicateTargetGender === 'MALE' ? 'Masculino' : duplicateTargetGender === 'FEMALE' ? 'Femenino' : 'Mixto'}`);
        setIsDuplicateDialogOpen(false);
        setSelectedIds(new Set());
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al duplicar categorías');
      }
    });
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-2 border-black dark:border-white bg-white dark:bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-foreground">
            <Activity className="w-5 h-5 text-primary" />
            Gestión de Categorías
          </h2>
          <p className="text-sm text-muted-foreground font-mono">Define los rangos de edad y géneros para la competencia.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {selectedIds.size > 0 && (
            <Button 
              onClick={() => setIsDuplicateDialogOpen(true)}
              variant="outline"
              className="rounded-none border-2 border-black dark:border-white bg-white dark:bg-card hover:bg-muted font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all h-12 px-6"
            >
              <Copy className="w-5 h-5 mr-2" />
              Duplicar ({selectedIds.size})
            </Button>
          )}
          <Button 
            onClick={handleOpenAdd}
            className="rounded-none border-2 border-black dark:border-white bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all h-12"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Categoría
          </Button>
        </div>
      </div>

      <div className="border-2 border-black dark:border-white bg-white dark:bg-card overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
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
              <TableHeader className="bg-black dark:bg-white">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="w-12 text-white dark:text-black">
                    <Checkbox 
                      checked={categories.length > 0 && selectedIds.size === categories.length}
                      onCheckedChange={handleSelectAll}
                      className="border-white dark:border-black data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                  </TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12">Categoría</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12">Género</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12 text-center">Edad</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category: Category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 border-b-2 border-black/10 dark:border-white/10">
                    <TableCell className="w-12">
                      <Checkbox 
                        checked={selectedIds.has(category.id)}
                        onCheckedChange={() => handleToggleSelect(category.id)}
                        className="border-black dark:border-white"
                      />
                    </TableCell>
                    <TableCell className="font-bold py-4">
                      <div className="flex flex-col">
                        <span className="uppercase tracking-tight text-foreground">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getGenderBadge(category.gender)}</TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 text-[10px]">{category.min_age}</span>
                        <span className="text-xs text-muted-foreground">-</span>
                        <span className="bg-black dark:bg-white text-white dark:text-black px-1.5 py-0.5 text-[10px]">{category.max_age}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(category)}
                          className="rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-card transition-all h-8 w-8"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(category)}
                          className="rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-destructive/10 hover:text-destructive transition-all h-8 w-8"
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
        <DialogContent className="rounded-none border-4 border-black dark:border-white p-0 overflow-hidden max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] bg-card">
          <DialogHeader className="bg-black dark:bg-white p-6">
            <DialogTitle className="text-white dark:text-black font-black uppercase tracking-widest flex items-center gap-2">
              {selectedCategory ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </DialogTitle>
            <DialogDescription className="text-gray-400 dark:text-gray-500 font-mono text-xs">
              Configura los detalles de la categoría para el evento.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit as any)} className="p-6 space-y-6">
              <FormInput
                control={form.control as any}
                name="name"
                label="Nombre de la Categoría"
                placeholder="Ej: Master A Masculino"
              />

              <FormSelect
                control={form.control as any}
                name="gender"
                label="Género"
                placeholder="Selecciona género"
                options={[
                  { value: 'MALE', label: 'Masculino' },
                  { value: 'FEMALE', label: 'Femenino' },
                  { value: 'MIXED', label: 'Mixto' },
                ]}
              />

              <div className="bg-muted/30 p-4 border-2 border-dashed border-black space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-[9px] uppercase font-black">Rango de Edad</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    control={form.control as any}
                    name="min_age"
                    label="Edad Mínima"
                    type="number"
                    labelClassName="text-[9px]"
                    inputClassName="h-10 font-mono"
                  />
                  <FormInput
                    control={form.control as any}
                    name="max_age"
                    label="Edad Máxima"
                    type="number"
                    labelClassName="text-[9px]"
                    inputClassName="h-10 font-mono"
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
                  disabled={categoryMutation.isPending}
                  className="rounded-none border-2 border-black dark:border-white bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all px-8"
                >
                  {categoryMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {selectedCategory ? 'Actualizar' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-none border-4 border-black dark:border-white p-0 overflow-hidden max-sm:max-w-[350px] sm:max-w-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] bg-card">
          <div className="bg-destructive p-6 flex flex-col items-center text-center text-white gap-4">
            <XCircle className="w-12 h-12" />
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">¿Eliminar categoría?</DialogTitle>
              <p className="text-xs font-mono opacity-90 mt-1">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-sm font-bold text-center">
              Estás a punto de eliminar la categoría <span className="underline italic text-foreground">"{selectedCategory?.name}"</span>.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-none border-2 border-black dark:border-white font-black uppercase tracking-widest hover:bg-muted"
              >
                No, volver
              </Button>
              <Button 
                variant="destructive"
                onClick={onDelete}
                disabled={categoryMutation.isPending}
                className="rounded-none border-2 border-black dark:border-white bg-destructive text-destructive-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {categoryMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sí, eliminar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DUPLICATE DIALOG */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent className="rounded-none border-4 border-black dark:border-white p-0 overflow-hidden max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] bg-card">
          <DialogHeader className="bg-black dark:bg-white p-6">
            <DialogTitle className="text-white dark:text-black font-black uppercase tracking-widest flex items-center gap-2">
              <Copy className="w-5 h-5" />
              Duplicar Categorías
            </DialogTitle>
            <DialogDescription className="text-gray-400 dark:text-gray-500 font-mono text-xs">
              Se duplicarán {selectedIds.size} categorías al género seleccionado.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest font-mono">Género de Destino</label>
              <div className="grid grid-cols-3 gap-2">
                {(['MALE', 'FEMALE', 'MIXED'] as const).map((g) => (
                  <Button
                    key={g}
                    type="button"
                    variant={duplicateTargetGender === g ? 'default' : 'outline'}
                    onClick={() => setDuplicateTargetGender(g)}
                    className={`rounded-none border-2 border-black dark:border-white font-bold uppercase text-[10px] h-10 ${
                      duplicateTargetGender === g ? 'bg-primary text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : ''
                    }`}
                  >
                    {g === 'MALE' ? 'Masc' : g === 'FEMALE' ? 'Fem' : 'Mixto'}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-muted/30 p-4 border-2 border-dashed border-black">
              <p className="text-[10px] font-mono leading-relaxed">
                <span className="font-black text-primary uppercase">Nota:</span> Se mantendrán los mismos rangos de edad y nombres. Si alguna categoría ya existe en el género de destino, la operación fallará para evitar duplicados exactos.
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsDuplicateDialogOpen(false)}
                className="rounded-none border-2 border-transparent hover:border-black font-bold uppercase text-xs"
              >
                Cancelar
              </Button>
              <Button 
                onClick={onDuplicate}
                disabled={categoryMutation.isPending}
                className="rounded-none border-2 border-black bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all px-8"
              >
                {categoryMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirmar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

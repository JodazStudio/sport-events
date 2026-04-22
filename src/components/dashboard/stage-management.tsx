'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2,
  XCircle,
  Layers,
  Activity,
  AlertTriangle
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
  Switch
} from '@/components/ui';
import { FormInput } from '@/components/ui/forms';
import { useAuthStore } from '@/store';
import { registrationStageFormSchema, type RegistrationStage } from '@/features/events/schemas';

interface StageManagementProps {
  eventId: string;
}

export function StageManagement({ eventId }: StageManagementProps) {
  const { session } = useAuthStore();
  
  // State
  const [stages, setStages] = useState<RegistrationStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<RegistrationStage | null>(null);

  const form = useForm({
    resolver: zodResolver(registrationStageFormSchema),
    defaultValues: {
      name: '',
      price_usd: 0,
      total_capacity: 100,
      is_active: false,
    },
  });

  // Load stages
  const fetchStages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stages?event_id=${eventId}`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch stages');
      const result = await response.json();
      setStages(result.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar etapas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchStages();
  }, [eventId]);

  // Handlers
  const handleOpenAdd = () => {
    setSelectedStage(null);
    form.reset({
      name: '',
      price_usd: 0,
      total_capacity: 100,
      is_active: false,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (stage: RegistrationStage) => {
    setSelectedStage(stage);
    form.reset({
      name: stage.name,
      price_usd: stage.price_usd,
      total_capacity: stage.total_capacity as number,
      is_active: stage.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (stage: RegistrationStage) => {
    setSelectedStage(stage);
    setIsDeleteModalOpen(true);
  };

  const onSubmit = async (values: any) => {
    if (!session?.access_token) return;

    setIsSubmitting(true);
    try {
      const method = selectedStage ? 'PUT' : 'POST';
      const body = {
        ...values,
        id: selectedStage?.id,
        event_id: eventId,
      };

      const response = await fetch('/api/stages', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al procesar etapa');
      }

      toast.success(selectedStage ? 'Etapa actualizada' : 'Etapa creada');
      setIsDialogOpen(false);
      fetchStages();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onToggleActive = async (stage: RegistrationStage, isActive: boolean) => {
    if (!session?.access_token) return;

    try {
      const response = await fetch('/api/stages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...stage,
          is_active: isActive,
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar estado');
      
      setStages(prev => prev.map(s => s.id === stage.id ? { ...s, is_active: isActive } : s));
      toast.success(isActive ? 'Etapa activada' : 'Etapa pausada');
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const onDelete = async () => {
    if (!session?.access_token || !selectedStage) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/stages?id=${selectedStage.id}&event_id=${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) throw new Error('Error al eliminar');

      toast.success('Etapa eliminada');
      setIsDeleteModalOpen(false);
      fetchStages();
    } catch (error) {
      toast.error('Error al eliminar etapa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-2 border-black dark:border-white bg-white dark:bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-foreground">
            <Layers className="w-5 h-5 text-primary" />
            Gestión de Etapas de Venta
          </h2>
          <p className="text-sm text-muted-foreground font-mono">Controla las fases de inscripción, precios y cupos.</p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          className="rounded-none border-2 border-black dark:border-white bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all h-12"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Etapa
        </Button>
      </div>

      <div className="border-2 border-black dark:border-white bg-white dark:bg-card overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <span className="font-mono text-sm uppercase font-black animate-pulse">Cargando etapas...</span>
          </div>
        ) : stages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-16 h-16 bg-muted border-2 border-dashed border-black flex items-center justify-center">
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black uppercase tracking-tight">No hay etapas configuradas</p>
              <p className="text-sm text-muted-foreground font-mono">Comienza creando la primera fase de venta para el evento.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black dark:bg-white">
                <TableRow className="hover:bg-transparent border-none">
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12">Nombre</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12">Precio (USD)</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12 text-center">Cupos</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12 text-center">Estado</TableHead>
                  <TableHead className="text-white dark:text-black font-mono uppercase font-black text-[10px] tracking-widest h-12 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stages.map((stage) => (
                  <TableRow key={stage.id} className="hover:bg-muted/50 border-b-2 border-black/10 dark:border-white/10">
                    <TableCell className="font-bold py-4">
                      <span className="uppercase tracking-tight text-foreground">{stage.name}</span>
                    </TableCell>
                    <TableCell className="font-mono font-bold text-lg text-foreground">${stage.price_usd}</TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      <div className="flex flex-col items-center">
                        <span className="text-xs uppercase text-muted-foreground mb-1">Usados / Total</span>
                        <div className="flex items-center gap-2">
                          <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 text-[10px]">{stage.used_capacity}</span>
                          <span className="text-xs text-muted-foreground">/</span>
                          <span className="border-2 border-black dark:border-white px-2 py-0.5 text-[10px] text-foreground">{stage.total_capacity}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Switch 
                          checked={stage.is_active} 
                          onCheckedChange={(checked) => onToggleActive(stage, checked)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <span className={`font-mono text-[9px] uppercase font-bold ${stage.is_active ? "text-primary" : "text-muted-foreground"}`}>
                          {stage.is_active ? "Activo" : "Pausado"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 px-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(stage)}
                          className="rounded-none border-2 border-transparent hover:border-black dark:hover:border-white hover:bg-white dark:hover:bg-card transition-all h-8 w-8 text-foreground"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDelete(stage)}
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

      {/* STAGE FORM DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-none border-4 border-black dark:border-white p-0 overflow-hidden max-w-md shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] bg-card">
          <DialogHeader className="bg-black dark:bg-white p-6">
            <DialogTitle className="text-white dark:text-black font-black uppercase tracking-widest flex items-center gap-2">
              {selectedStage ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {selectedStage ? 'Editar Etapa' : 'Nueva Etapa'}
            </DialogTitle>
            <DialogDescription className="text-gray-400 dark:text-gray-500 font-mono text-xs">
              Configura los detalles de la fase de venta.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
              <FormInput
                control={form.control}
                name="name"
                label="Nombre de la Etapa"
                placeholder="Ej: Preventa 1"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  control={form.control}
                  name="price_usd"
                  label="Precio (USD)"
                  type="number"
                  step="0.01"
                  inputClassName="font-mono"
                />
                <FormInput
                  control={form.control}
                  name="total_capacity"
                  label="Cupo Máximo"
                  type="number"
                  inputClassName="font-mono"
                />
              </div>

              <div className="bg-muted/30 p-4 border-2 border-dashed border-black dark:border-white flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-black uppercase text-xs text-foreground">Estado Inicial</div>
                  <div className="text-[10px] text-muted-foreground font-mono">¿Comienza activa?</div>
                </div>
                <div className="flex items-center gap-2">
                   <Switch 
                    checked={form.watch('is_active')}
                    onCheckedChange={(checked) => form.setValue('is_active', checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className="font-mono text-[9px] uppercase font-bold">
                    {form.watch('is_active') ? "Activo" : "Pausado"}
                  </span>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsDialogOpen(false)}
                  className="rounded-none border-2 border-transparent hover:border-black dark:hover:border-white font-bold uppercase text-xs text-foreground"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="rounded-none border-2 border-black dark:border-white bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all px-8"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {selectedStage ? 'Actualizar' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION MODAL */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="rounded-none border-4 border-black dark:border-white p-0 overflow-hidden max-w-sm shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] bg-card">
          <div className="bg-destructive p-6 flex flex-col items-center text-center text-white gap-4">
            <XCircle className="w-12 h-12" />
            <div>
              <DialogTitle className="text-xl font-black uppercase tracking-tighter">¿Eliminar etapa?</DialogTitle>
              <p className="text-xs font-mono opacity-90 mt-1">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-sm font-bold text-center text-foreground">
              Estás a punto de eliminar la etapa <span className="underline italic">"{selectedStage?.name}"</span>.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-none border-2 border-black dark:border-white font-black uppercase tracking-widest hover:bg-muted text-foreground"
              >
                No, volver
              </Button>
              <Button 
                variant="destructive"
                onClick={onDelete}
                disabled={isSubmitting}
                className="rounded-none border-2 border-black dark:border-white bg-destructive text-destructive-foreground font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
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

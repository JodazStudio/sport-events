'use client';

import { useState, useEffect } from 'react';
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui';
import { Badge } from '@/components/ui';
import { toast } from 'sonner';
import { useAuthStore } from '@/store';
import { 
  MoreHorizontal, 
  Plus, 
  ExternalLink, 
  UserCircle, 
  Settings, 
  Trash2, 
  Loader2,
  Calendar,
  Clock,
  Search,
  Filter,
  Globe,
  Activity,
  Users,
  ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Manager {
  id: string;
  name: string;
  email: string;
}

interface Event {
  id: string;
  name: string;
  slug: string;
  event_date: string;
  event_time: string;
  manager_id: string;
  managers: Manager;
  created_at: string;
  status?: string; // For compatibility with badge logic
}

export default function SuperadminEventsPage() {
  const { session, startImpersonation } = useAuthStore();
  
  // State
  const [events, setEvents] = useState<Event[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  
  // Modal States
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    manager_id: '',
    name: '',
    slug: '',
    event_date: '',
    event_time: ''
  });
  
  const [deleteConfirmName, setDeleteConfirmName] = useState('');

  const fetchData = async () => {
    if (!session?.access_token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/superadmin/events', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al cargar datos');
      
      const data = await response.json();
      setEvents(data.events || []);
      setManagers(data.managers || []);
    } catch (error) {
      toast.error('No se pudieron cargar los eventos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [session]);

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(search.toLowerCase()) || 
    event.managers?.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSlugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: handleSlugify(name)
    }));
  };

  const handleProvisionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/superadmin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Error al aprovisionar evento');
      
      toast.success('Evento creado correctamente');
      setIsProvisionModalOpen(false);
      setFormData({ manager_id: '', name: '', slug: '', event_date: '', event_time: '' });
      fetchData();
    } catch (error) {
      toast.error('Error al crear el evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token || !selectedEvent) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/superadmin/events', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          id: selectedEvent.id,
          ...formData
        })
      });
      
      if (!response.ok) throw new Error('Error al actualizar');
      
      toast.success('Evento actualizado');
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al actualizar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token || !selectedEvent) return;
    
    if (deleteConfirmName !== selectedEvent.name) {
      toast.error('El nombre no coincide');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/superadmin/events?id=${selectedEvent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar');
      
      toast.success('Evento eliminado');
      setIsDeleteModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al eliminar');
    } finally {
      setIsSubmitting(false);
    }
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
        return <Badge className="bg-primary text-white rounded-none italic uppercase text-[9px] tracking-widest px-2">ACTIVO</Badge>;
    }
  };

  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      manager_id: event.manager_id,
      name: event.name,
      slug: event.slug,
      event_date: event.event_date,
      event_time: event.event_time
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
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
              onChange={(e) => setSearch(e.target.value)}
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
            <DialogContent className="sm:max-w-[500px] rounded-none border-4 border-black">
              <form onSubmit={handleProvisionSubmit}>
                <DialogHeader>
                  <DialogTitle className="font-satoshi text-2xl font-black italic uppercase">Provision Event</DialogTitle>
                  <DialogDescription className="font-medium italic">
                    Crea un nuevo evento y asígnalo a un organizador.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-6">
                  <div className="grid gap-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest">Organizador Responsable</Label>
                    <Select 
                      onValueChange={(val) => setFormData(p => ({ ...p, manager_id: val }))}
                      value={formData.manager_id}
                    >
                      <SelectTrigger className="rounded-none border-2 border-black">
                        <SelectValue placeholder="Seleccionar organizador" />
                      </SelectTrigger>
                      <SelectContent className="rounded-none border-2 border-black">
                        {managers.map((m) => (
                          <SelectItem key={m.id} value={m.id} className="font-medium italic">
                            {m.name} ({m.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest">Nombre del Evento</Label>
                    <Input 
                      placeholder="Ej. Maratón de la Ciudad" 
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="rounded-none border-2 border-black italic font-bold"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest">Slug URL</Label>
                    <Input 
                      placeholder="maraton-ciudad" 
                      value={formData.slug}
                      onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                      className="rounded-none border-2 border-black font-mono text-sm"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="font-mono text-[10px] uppercase tracking-widest">Fecha</Label>
                      <Input 
                        type="date" 
                        value={formData.event_date}
                        onChange={(e) => setFormData(p => ({ ...p, event_date: e.target.value }))}
                        className="rounded-none border-2 border-black"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="font-mono text-[10px] uppercase tracking-widest">Hora</Label>
                      <Input 
                        type="time" 
                        value={formData.event_time}
                        onChange={(e) => setFormData(p => ({ ...p, event_time: e.target.value }))}
                        className="rounded-none border-2 border-black"
                        required
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting} className="w-full rounded-none border-2 border-black bg-black text-white font-black italic uppercase py-6">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar Provisión'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-card border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-b-2 border-black">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">Evento</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">URL</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">Organizador</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-5">Fecha / Hora</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
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
              filteredEvents.map((event) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-black hover:text-white rounded-none">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[220px] rounded-none border-2 border-black font-medium italic">
                        <DropdownMenuLabel className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">Control Maestro</DropdownMenuLabel>
                        <DropdownMenuItem 
                          onClick={() => {
                            startImpersonation(event.manager_id);
                            toast.success(`Modo Dios: ${event.managers?.name}`);
                          }}
                          className="cursor-pointer text-blue-600 focus:bg-blue-50"
                        >
                          <UserCircle className="mr-2 h-4 w-4" />
                          Impersonate Owner
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-black/10" />
                        <DropdownMenuItem onClick={() => openEditModal(event)} className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Override Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedEvent(event);
                            setIsDeleteModalOpen(true);
                          }} 
                          className="cursor-pointer text-destructive focus:bg-destructive/5"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats Summary for Superadmin */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Registros", value: "2,450", icon: Users },
          { label: "Eventos Activos", value: events.length.toString(), icon: Globe },
          { label: "Ingresos Proyectados", value: "$12.4k", icon: ArrowUpRight },
          { label: "Tasa de Conversión", value: "18%", icon: Activity },
        ].map((stat, i) => (
          <div key={i} className="bg-card border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group hover:translate-x-1 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="font-satoshi text-3xl font-black italic">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none border-4 border-black">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle className="font-satoshi text-2xl font-black italic uppercase">Override Event</DialogTitle>
              <DialogDescription className="font-medium italic">
                Sobrescribe la configuración global de este evento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <Label className="font-mono text-[10px] uppercase tracking-widest">Re-asignar Dueño</Label>
                <Select 
                  onValueChange={(val) => setFormData(p => ({ ...p, manager_id: val }))}
                  value={formData.manager_id}
                >
                  <SelectTrigger className="rounded-none border-2 border-black">
                    <SelectValue placeholder="Seleccionar nuevo dueño" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-2 border-black">
                    {managers.map((m) => (
                      <SelectItem key={m.id} value={m.id} className="font-medium italic">
                        {m.name} ({m.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label className="font-mono text-[10px] uppercase tracking-widest">Nombre del Evento</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="rounded-none border-2 border-black italic font-bold"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="font-mono text-[10px] uppercase tracking-widest">URL Slug</Label>
                <Input 
                  value={formData.slug}
                  onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                  className="rounded-none border-2 border-black font-mono text-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest">Fecha</Label>
                  <Input 
                    type="date" 
                    value={formData.event_date}
                    onChange={(e) => setFormData(p => ({ ...p, event_date: e.target.value }))}
                    className="rounded-none border-2 border-black"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest">Hora</Label>
                  <Input 
                    type="time" 
                    value={formData.event_time}
                    onChange={(e) => setFormData(p => ({ ...p, event_time: e.target.value }))}
                    className="rounded-none border-2 border-black"
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-none border-2 border-black bg-black text-white font-black italic uppercase py-6">
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-none border-4 border-destructive">
          <form onSubmit={handleDeleteSubmit}>
            <DialogHeader>
              <DialogTitle className="font-satoshi text-2xl font-black italic uppercase text-destructive">Confirm Deletion</DialogTitle>
              <DialogDescription className="font-medium italic">
                Esta acción es irreversible y eliminará todos los datos asociados.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <p className="text-sm font-medium italic">
                Escribe <span className="font-bold underline uppercase">{selectedEvent?.name}</span> para confirmar:
              </p>
              <Input 
                value={deleteConfirmName}
                onChange={(e) => setDeleteConfirmName(e.target.value)}
                placeholder="Nombre del evento"
                className="rounded-none border-2 border-destructive italic font-bold"
                required
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                variant="destructive" 
                disabled={isSubmitting || deleteConfirmName !== selectedEvent?.name}
                className="w-full rounded-none font-black italic uppercase py-6"
              >
                Eliminar Permanentemente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

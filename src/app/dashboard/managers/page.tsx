"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  ExternalLink, 
  Mail, 
  ShieldAlert, 
  Loader2, 
  Eye, 
  EyeOff,
  KeyRound,
  Trash2
} from "lucide-react";
import { useAuthStore } from "@/store";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Manager } from "@/app/api/managers/route";

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { session } = useAuthStore();

  const fetchManagers = useCallback(async () => {
    if (!session?.access_token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/managers', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Error al cargar managers');
      const data = await response.json();
      setManagers(data);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "No se pudieron cargar los managers."
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/managers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear manager');
      }

      toast.success("Manager creado", {
        description: `Se ha creado la cuenta para ${newName} correctamente.`
      });
      
      // Reset and close
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setIsCreateModalOpen(false);
      
      // Refresh list
      fetchManagers();
    } catch (error: any) {
      toast.error("Error", {
        description: error.message || "No se pudo crear la cuenta."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-satoshi text-3xl font-black uppercase tracking-tight italic text-foreground">
            Cuentas de <span className="text-primary">Manager</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Gestiona los organizadores de eventos y sus accesos al sistema.
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black italic uppercase tracking-widest rounded-none gap-2 h-12 px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
              <Plus className="h-5 w-5" strokeWidth={3} />
              Añadir Nuevo Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-none border-2 border-black p-0 overflow-hidden bg-card">
            <div className="bg-primary p-4 border-b-2 border-black">
              <DialogTitle className="font-satoshi font-black uppercase tracking-tight italic text-2xl text-primary-foreground">
                NUEVA <span className="text-black">CUENTA</span>
              </DialogTitle>
            </div>
            <div className="p-6 pt-4">
              <DialogDescription className="font-medium text-foreground mb-4">
                Crea una cuenta para un organizador. Se le asignará el rol de administrador automáticamente.
              </DialogDescription>
              <form onSubmit={handleCreateManager} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Nombre Completo</Label>
                  <Input 
                    id="name" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="Ej. Juan Pérez" 
                    className="rounded-none border-2 border-black font-medium h-11 focus-visible:ring-0 focus-visible:border-primary" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Correo Electrónico</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    placeholder="juan@ejemplo.com" 
                    className="rounded-none border-2 border-black font-medium h-11 focus-visible:ring-0 focus-visible:border-primary" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Contraseña Inicial</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="••••••••" 
                      className="rounded-none border-2 border-black font-medium h-11 pr-10 focus-visible:ring-0 focus-visible:border-primary" 
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 font-black uppercase italic tracking-widest rounded-none h-12 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        CREANDO...
                      </div>
                    ) : "CREAR CUENTA DE MANAGER"}
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Cargando base de datos...</span>
          </div>
        ) : managers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <ShieldAlert className="h-12 w-12 text-muted-foreground/30" strokeWidth={1} />
            <p className="font-medium text-muted-foreground italic">No se encontraron managers en el sistema.</p>
            <Button variant="link" onClick={() => setIsCreateModalOpen(true)} className="text-primary font-bold uppercase italic tracking-widest">
              Crea el primero ahora
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-black/5">
                <TableRow className="hover:bg-transparent border-b-2 border-black">
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] py-5 px-6 font-bold text-black border-r-2 border-black/10">Nombre del Manager</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] py-5 px-6 font-bold text-black border-r-2 border-black/10">Identidad Digital (Email)</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] py-5 px-6 font-bold text-black text-center border-r-2 border-black/10">Rol</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] py-5 px-6 font-bold text-black border-r-2 border-black/10">Fecha Registro</TableHead>
                  <TableHead className="font-mono text-[10px] uppercase tracking-[0.2em] py-5 px-6 font-bold text-black text-right">Sistema</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id} className="border-b-2 border-black/10 transition-colors hover:bg-primary/5 group">
                    <TableCell className="font-black py-5 px-6 italic text-lg uppercase tracking-tight group-hover:text-primary transition-colors">
                      {manager.name}
                    </TableCell>
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2 font-mono text-sm font-bold text-muted-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        {manager.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-center py-5 px-6">
                      <Badge className="rounded-none bg-black text-white hover:bg-black font-black italic uppercase text-[9px] tracking-[0.2em] px-3 py-1 border-2 border-black box-content h-3 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(var(--primary-rgb),0.5)]">
                        {manager.role === 'superadmin' ? 'SUPER' : 'ADMIN'}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-5 px-6 font-mono text-xs font-bold whitespace-nowrap">
                      {manager.created_at ? format(new Date(manager.created_at), "dd/MM/yyyy · HH:mm", { locale: es }) : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right py-5 px-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-10 w-10 p-0 rounded-none border-2 border-transparent hover:border-black hover:bg-primary/10 transition-all">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-none border-2 border-black w-64 p-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-card overflow-hidden">
                          <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-[0.2em] px-4 py-3 bg-black text-white border-b-2 border-black">
                            Control de Sistema
                          </DropdownMenuLabel>
                          <div className="p-1">
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer font-bold italic uppercase text-xs tracking-wider hover:bg-primary/5">
                              <KeyRound className="h-4 w-4 text-primary" />
                              Cambiar Contraseña
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer font-bold italic uppercase text-xs tracking-wider hover:bg-primary/5">
                              <ExternalLink className="h-4 w-4 text-primary" />
                              Perfil Detallado
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-black/10 h-[2px]" />
                            <DropdownMenuItem className="flex items-center gap-3 px-3 py-3 cursor-pointer font-black italic uppercase text-xs tracking-wider text-destructive focus:text-destructive focus:bg-destructive/10">
                              <Trash2 className="h-4 w-4" strokeWidth={3} />
                              Eliminar Cuenta
                            </DropdownMenuItem>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between border-2 border-black bg-muted p-4 font-mono text-[10px] uppercase tracking-[0.3em] font-black">
        <div className="flex items-center gap-4">
          <span>SISTEMA: ZONACRONO_OS_V1</span>
          <span className="text-primary">ESTADO: OPERACIONAL</span>
        </div>
        <div>
          CUENTAS ACTIVAS: {managers.length}
        </div>
      </div>
    </div>
  );
}

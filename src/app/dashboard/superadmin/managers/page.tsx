"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, UserCheck, UserX, ExternalLink, Mail, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Mock data for managers
const MOCK_MANAGERS = [
  { id: "m1", name: "Juan Pérez", email: "juan@eventos.com", totalEvents: 12, status: "active" },
  { id: "m2", name: "María Rodríguez", email: "maria@sport.ve", totalEvents: 5, status: "active" },
  { id: "m3", name: "Carlos López", email: "carlos@race.com", totalEvents: 0, status: "suspended" },
  { id: "m4", name: "Ana Martínez", email: "ana@cronometra.me", totalEvents: 24, status: "active" },
];

export default function ManagersPage() {
  const startImpersonation = useAuthStore((state) => state.startImpersonation);
  const [managers, setManagers] = useState(MOCK_MANAGERS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleCreateManager = (e: React.FormEvent) => {
    e.preventDefault();
    const newManager = {
      id: `m${managers.length + 1}`,
      name: newName,
      email: newEmail,
      totalEvents: 0,
      status: "active" as const
    };
    setManagers([newManager, ...managers]);
    setIsCreateModalOpen(false);
    toast.success("Manager creado", {
      description: `Se ha creado la cuenta para ${newName} correctamente.`
    });
    // Clear form
    setNewName("");
    setNewEmail("");
    setNewPassword("");
  };

  const handleImpersonate = (managerId: string, managerName: string) => {
    startImpersonation(managerId);
    toast.success("Modo Dios activado", {
      description: `Ahora estás visualizando el panel como ${managerName}.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-satoshi text-3xl font-black uppercase tracking-tight italic text-foreground">
            Cuentas de <span className="text-primary">Manager</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Gestiona los organizadores de eventos y accede a sus paneles en modo dios.
          </p>
        </div>

        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground font-black italic uppercase tracking-widest rounded-none gap-2">
              <Plus className="h-4 w-4" strokeWidth={3} />
              Añadir Nuevo Manager
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-none border-2">
            <DialogHeader>
              <DialogTitle className="font-satoshi font-black uppercase tracking-tight italic text-2xl">
                NUEVA <span className="text-primary">CUENTA</span>
              </DialogTitle>
              <DialogDescription className="font-medium">
                Crea una cuenta para un organizador. Deberás enviarle sus credenciales manualmente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateManager} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pr-2">Nombre Completo</Label>
                <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej. Juan Pérez" className="rounded-none border-2 font-medium" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pr-2">Correo Electrónico</Label>
                <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="juan@ejemplo.com" className="rounded-none border-2 font-medium" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground pr-2">Contraseña Inicial</Label>
                <Input id="password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="rounded-none border-2 font-medium" required />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full bg-primary font-bold uppercase italic tracking-widest rounded-none">
                  Crear Cuenta de Manager
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border-2 border-border shadow-xl rounded-none overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Nombre del Manager</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Email</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4 text-center">Eventos Totales</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4">Estado</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest py-4 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.id} className="border-b transition-colors hover:bg-muted/30">
                <TableCell className="font-bold py-4 italic">{manager.name}</TableCell>
                <TableCell className="text-muted-foreground py-4">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Mail className="h-3 w-3" />
                    {manager.email}
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono py-4">{manager.totalEvents}</TableCell>
                <TableCell className="py-4">
                  <Badge variant={manager.status === 'active' ? 'default' : 'destructive'} className="rounded-none font-black italic uppercase text-[9px] tracking-widest px-2">
                    {manager.status === 'active' ? 'ACTIVO' : 'SUSPENDIDO'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right py-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none border-2 w-56">
                      <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-widest">Opciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleImpersonate(manager.id, manager.name)} className="flex items-center gap-2 text-amber-600 focus:text-amber-600 focus:bg-amber-50 cursor-pointer font-bold italic">
                        <ShieldAlert className="h-4 w-4" />
                        Modo Dios / Ver Panel
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer font-medium">
                        <ExternalLink className="h-4 w-4" />
                        Ver Perfil Completo
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 cursor-pointer font-medium text-destructive focus:text-destructive">
                        {manager.status === 'active' ? (
                          <>
                            <UserX className="h-4 w-4" />
                            Suspender Cuenta
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            Activar Cuenta
                          </>
                        )}
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
  );
}

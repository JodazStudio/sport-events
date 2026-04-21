"use client";

import { useState } from "react";
import { 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Layers, 
  Tag,
  Check,
  X
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
import { Badge } from "../ui/badge";

const stages = [
  { id: 1, name: "Preventa 1", price: "25.00", capacity: 100, active: true },
  { id: 2, name: "Fase 2", price: "35.00", capacity: 200, active: false },
  { id: 3, name: "Último Llamado", price: "45.00", capacity: 200, active: false },
];

const categories = [
  { id: 1, name: "Master A Masculino", gender: "Masculino", minAge: 30, maxAge: 39 },
  { id: 2, name: "Libre Femenino", gender: "Femenino", minAge: 18, maxAge: 99 },
  { id: 3, name: "Juvenil Mixto", gender: "Mixto", minAge: 12, maxAge: 17 },
  { id: 4, name: "Master B Femenino", gender: "Femenino", minAge: 40, maxAge: 49 },
];

export function ConfigView() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2">
            Configuración del <span className="text-primary">Evento</span>
          </h2>
          <p className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-wider">
            Gestiona etapas de inscripción y categorías de atletas
          </p>
        </div>
      </div>

      <Tabs defaultValue="stages" className="w-full">
        <TabsList className="bg-muted p-1 rounded-none border-2 border-border h-auto mb-8 grid grid-cols-2 lg:inline-flex">
          <TabsTrigger value="stages" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Layers className="mr-2 size-4 hidden sm:inline" />
            Etapas
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase italic px-4 md:px-6 py-3 tracking-tight text-xs md:text-sm">
            <Tag className="mr-2 size-4 hidden sm:inline" />
            Categorías
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 border-2 border-dashed border-border gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground text-balance">Precio Activo: Preventa 1</span>
            </div>
            <Button className="btn-mechanical rounded-none bg-primary hover:bg-primary/90 text-white border-0 w-full sm:w-auto">
               <Plus className="mr-2 h-4 w-4" /> Nueva Etapa
            </Button>
          </div>

          <div className="border-2 border-border bg-card overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="bg-muted/50 border-b-2">
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Nombre</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Precio (USD)</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Capacidad</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Estado</TableHead>
                    <TableHead className="text-right py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stages.map((stage) => (
                    <TableRow key={stage.id} className="border-b hover:bg-muted/30 transition-colors">
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
                      <TableCell className="text-right py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-none border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit2 className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
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

        <TabsContent value="categories" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-4 border-2 border-dashed border-border gap-4">
             <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">Total Categorías: {categories.length}</span>
            </div>
            <Button className="btn-mechanical rounded-none bg-primary hover:bg-primary/90 text-white border-0 w-full sm:w-auto">
               <Plus className="mr-2 h-4 w-4" /> Añadir Categoría
            </Button>
          </div>

          <div className="border-2 border-border bg-card overflow-x-auto">
            <div className="min-w-[600px]">
              <Table>
                <TableHeader className="bg-muted/50 border-b-2">
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Nombre</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Género</TableHead>
                    <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Rango de Edad</TableHead>
                    <TableHead className="text-right py-4"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id} className="border-b hover:bg-muted/30 transition-colors">
                      <TableCell className="font-black italic uppercase tracking-tight py-4">{cat.name}</TableCell>
                      <TableCell className="py-4">
                          <Badge variant="outline" className="rounded-none border-border font-mono text-[9px] uppercase tracking-widest">
                              {cat.gender}
                          </Badge>
                      </TableCell>
                      <TableCell className="font-mono py-4 text-muted-foreground uppercase text-[10px]">
                          {cat.minAge} — {cat.maxAge === 99 ? '∞' : cat.maxAge} AÑOS
                      </TableCell>
                      <TableCell className="text-right py-4">
                         <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-border hover:bg-primary/10 hover:border-primary group">
                                  <Edit2 className="h-3 w-3 group-hover:text-primary" />
                              </Button>
                              <Button variant="outline" size="icon" className="h-8 w-8 rounded-none border-border hover:bg-destructive/10 hover:border-destructive group">
                                  <Trash2 className="h-3 w-3 group-hover:text-destructive" />
                              </Button>
                         </div>
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


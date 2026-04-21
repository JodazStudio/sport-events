"use client";

import { useAuthStore } from "@/store";
import { AlertCircle, LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function GodModeBanner() {
  const { impersonatedAdminId, stopImpersonation, role } = useAuthStore();

  if (role !== 'superadmin' || !impersonatedAdminId) return null;

  // In a real app, we would fetch the manager's name based on impersonatedAdminId
  const managerName = "Administrador de Evento"; 

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 flex items-center justify-between border-b border-amber-600 shadow-sm animate-in slide-in-from-top duration-300">
      <div className="flex items-center gap-3">
        <div className="bg-amber-950/10 p-1.5 rounded-full">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:gap-2">
          <span className="font-satoshi font-black uppercase tracking-tight text-sm italic">
            MODO DIOS ACTIVO:
          </span>
          <span className="text-sm font-medium">
            Visualizando como <strong className="font-black underline">{managerName}</strong> (ID: {impersonatedAdminId})
          </span>
        </div>
      </div>
      
      <Button 
        onClick={stopImpersonation}
        variant="outline" 
        size="sm"
        className="bg-amber-950 text-white border-none hover:bg-amber-900 font-mono text-[10px] uppercase tracking-widest h-8 px-3 gap-2"
      >
        <LogOut className="h-3 w-3" />
        Salir del modo dios
      </Button>
    </div>
  );
}

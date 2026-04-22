"use client";

import { Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "@/lib";

interface ConfigActionsProps {
  activeTab: string;
  isPending: boolean;
  onDelete?: () => void;
}

export function ConfigActions({ activeTab, isPending, onDelete }: ConfigActionsProps) {
  if (activeTab !== 'general' && activeTab !== 'media' && activeTab !== 'payments') {
    return null;
  }

  return (
    <div className={cn(
      "flex items-center gap-4 pt-4",
      activeTab !== 'general' ? "justify-end" : "justify-between"
    )}>
      {activeTab == 'general' && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDelete}
          className="rounded-none border-2 border-black dark:border-white font-black uppercase italic tracking-widest py-6 px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          Eliminar Evento
        </Button>
      )}

      <Button 
        type="submit" 
        disabled={isPending}
        className="rounded-none border-2 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-black uppercase italic tracking-widest py-6 px-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
      >
        {isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
        Guardar Cambios
      </Button>
    </div>
  );
}

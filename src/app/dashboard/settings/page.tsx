"use client";

import { TelegramSettings } from "@/components/dashboard/telegram-settings";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2">
          Configuración <span className="text-primary">Personal</span>
        </h2>
        <p className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-wider">
          Gestiona tus preferencias y vinculaciones externas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TelegramSettings />
        
        {/* Placeholder for future settings */}
        <div className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-none p-12 flex flex-col items-center justify-center text-center gap-4">
          <div className="p-4 bg-muted rounded-full">
            <span className="text-2xl">⚙️</span>
          </div>
          <div>
            <p className="font-black uppercase italic text-sm">Más ajustes próximamente</p>
            <p className="font-mono text-[10px] uppercase text-muted-foreground">Estamos trabajando en nuevas integraciones.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

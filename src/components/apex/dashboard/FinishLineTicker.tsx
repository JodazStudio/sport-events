"use client";

import { Athlete, getCountryFlag } from "@/lib/mock-race-data";
import { Flag, Trophy } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FinishLineTickerProps {
  finishers: Athlete[];
}

const FinishLineTicker = ({ finishers }: FinishLineTickerProps) => {
  return (
    <div className="flex flex-col h-full bg-card border border-l-0">
      <div className="p-4 border-b flex items-center gap-2 bg-muted/30">
        <Flag className="h-4 w-4 text-primary" />
        <h3 className="font-satoshi text-sm font-black uppercase tracking-tight">Últimas Llegadas</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {finishers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground font-mono text-xs italic uppercase">
              Esperando corredores...
            </div>
          ) : (
            finishers.map((athlete) => (
              <div key={athlete.bib} className="p-4 hover:bg-muted/30 transition-colors animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCountryFlag(athlete.country)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-satoshi font-black text-sm uppercase truncate font-bold">
                      {athlete.name}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest italic">
                        {athlete.category} · BIB #{athlete.bib}
                      </span>
                      <span className="font-mono text-xs font-bold text-green-500">
                        {athlete.totalTime}
                      </span>
                    </div>
                  </div>
                </div>
                
                {finishers[0].bib === athlete.bib && (
                  <div className="mt-3 flex items-center gap-2 bg-primary/10 border border-primary/20 px-2 py-1 ">
                    <Trophy className="h-3 w-3 text-primary" />
                    <span className="font-mono text-[9px] font-bold text-primary uppercase animate-pulse">
                      ¡Cruzó la meta!
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      {/* Visual decorative element - "The tape" */}
      <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
    </div>
  );
};

export default FinishLineTicker;

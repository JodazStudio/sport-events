"use client";

import { Badge } from "../ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "../ui/dialog";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Athlete, getCountryFlag } from "@/lib";
import { Timer, Zap, Map } from "lucide-react";

interface AthleteModalProps {
  athlete: Athlete | null;
  isOpen: boolean;
  onClose: () => void;
}

// Simulated split data for the chart
const generateSplits = (athlete: Athlete) => {
  const points = ["5K", "10K", "15K", "21K", "25K", "30K", "35K", "40K", "Finish"];
  return points.map((p, i) => ({
    name: p,
    pace: 4 + Math.random() * 0.5,
    rank: Math.max(1, (athlete.rank || 10) + (Math.random() * 10 - 5)),
  }));
};

export const AthleteModal = ({ athlete, isOpen, onClose }: AthleteModalProps) => {
  if (!athlete) return null;

  const splits = generateSplits(athlete);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-2 p-0 border-primary shadow-xl dark:shadow-primary/20">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <span className="text-4xl">{getCountryFlag(athlete.country)}</span>
               <div>
                  <DialogTitle className="font-satoshi font-black text-2xl uppercase tracking-tighter text-foreground">
                    {athlete.name}
                  </DialogTitle>
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    BIB #{athlete.bib} · {athlete.country}
                  </p>
               </div>
            </div>
            <Badge className="bg-primary text-primary-foreground font-mono text-[10px] uppercase px-3 py-1">
              {athlete.status}
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-px bg-border dark:bg-white/10 border mt-6 overflow-hidden">
            <div className="bg-muted/30 p-3 text-center">
              <Timer className="h-3.5 w-3.5 mx-auto mb-1 text-primary" />
              <div className="font-mono text-xs text-muted-foreground uppercase">Tiempo</div>
              <div className="font-mono text-lg font-bold text-foreground">{athlete.totalTime || '--:--:--'}</div>
            </div>
            <div className="bg-muted/30 p-3 text-center">
              <Zap className="h-3.5 w-3.5 mx-auto mb-1 text-blue-500" />
              <div className="font-mono text-xs text-muted-foreground uppercase">Ritmo Medio</div>
              <div className="font-mono text-lg font-bold text-foreground">{athlete.pace || '--:--'}</div>
            </div>
            <div className="bg-muted/30 p-3 text-center">
              <Map className="h-3.5 w-3.5 mx-auto mb-1 text-green-500" />
              <div className="font-mono text-xs text-muted-foreground uppercase">Distancia</div>
              <div className="font-mono text-lg font-bold text-foreground">{athlete.lastCheckpoint.toFixed(1)} km</div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          <h4 className="font-satoshi text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">
            Evolución del Ritmo (min/km)
          </h4>
          <div className="h-[200px] w-full bg-muted/20 border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={splits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#888" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#888" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[3.5, 5.5]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--foreground))' }} 
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pace" 
                  stroke="#f97316" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#f97316' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 flex items-center justify-between font-mono text-[9px] uppercase text-muted-foreground border-t pt-4">
            <span>PREVISIÓN DE META: 02:44:12</span>
            <span>PROBABILIDAD PODIO: 12%</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


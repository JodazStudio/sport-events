import { MapPin } from "lucide-react";

interface CourseProgressProps {
  maxDistance: number; // 42.195 for marathon
  leaderDistance: number;
  averageDistance: number;
}

const milestones = [
  { km: 0, label: "KM 0" },
  { km: 10, label: "KM 10" },
  { km: 21, label: "MEDIO" },
  { km: 30, label: "KM 30" },
  { km: 40, label: "KM 40" },
  { km: 42.195, label: "META" },
];

export const CourseProgress = ({ maxDistance, leaderDistance, averageDistance }: CourseProgressProps) => {
  const leaderPos = (leaderDistance / maxDistance) * 100;
  const averagePos = (averageDistance / maxDistance) * 100;

  return (
    <div className="p-8 bg-card border border-t-0 blueprint-grid relative overflow-hidden">
      <div className="flex items-center gap-2 mb-8">
        <MapPin className="h-4 w-4 text-primary" />
        <h3 className="font-satoshi text-sm font-black uppercase tracking-tight">Progreso del Circuito</h3>
      </div>

      <div className="relative mt-12 mb-16 h-2 bg-muted-foreground/10 border border-muted-foreground/20">
        {/* Milestone markers */}
        {milestones.map((m) => (
          <div 
            key={m.label} 
            className="absolute -top-1 bottom-0 border-l border-muted-foreground/30"
            style={{ left: `${(m.km / maxDistance) * 100}%` }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase font-bold text-muted-foreground whitespace-nowrap">
              {m.label}
            </div>
          </div>
        ))}

        {/* Average pack runner */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-4 w-1 bg-muted-foreground/40 transition-all duration-1000 ease-in-out"
          style={{ left: `${averagePos}%` }}
        >
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase text-muted-foreground whitespace-nowrap">
            Grupeta
          </div>
        </div>

        {/* Leader runner */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 h-6 w-1 bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000 ease-in-out"
          style={{ left: `${leaderPos}%` }}
        >
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[8px] font-bold text-primary whitespace-nowrap uppercase">
            Líder
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary animate-ping" />
        </div>
      </div>

      {/* Decorative Blueprint Corner */}
      <div className="absolute bottom-2 right-2 font-mono text-[8px] text-muted-foreground/30 uppercase">
        REF: TIMING_MAP_V2
        <br />
        SCALE: 1:42195
      </div>
    </div>
  );
};


import { Timer, Users, MapPin, Thermometer } from "lucide-react";

interface RaceStatsProps {
  elapsedTime: string;
  totalParticipants: number;
  finishedCount: number;
  leaderDistance: number;
  temp: number;
}

export const RaceStats = ({
  elapsedTime,
  totalParticipants,
  finishedCount,
  leaderDistance,
  temp,
}: RaceStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
      <div className="bg-card p-6 border-l-4 border-primary">
        <div className="flex items-center gap-2 mb-2">
          <Timer className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Race Time</span>
        </div>
        <div className="font-mono text-3xl font-bold tracking-tighter text-foreground tabular-nums">
          {elapsedTime}
        </div>
      </div>

      <div className="bg-card p-6 border-l-4 border-blue-500">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Field Status</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold text-foreground">{finishedCount}</span>
          <span className="font-mono text-sm text-muted-foreground">/ {totalParticipants} FINISHED</span>
        </div>
      </div>

      <div className="bg-card p-6 border-l-4 border-green-500">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-green-500" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Leader Location</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold text-foreground">{leaderDistance.toFixed(1)}</span>
          <span className="font-mono text-sm text-muted-foreground">KM</span>
        </div>
      </div>

      <div className="bg-card p-6 border-l-4 border-orange-400">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer className="h-4 w-4 text-orange-400" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Condition</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold text-foreground">{temp}°</span>
          <span className="font-mono text-sm text-muted-foreground">C · HUM 64%</span>
        </div>
      </div>
    </div>
  );
};


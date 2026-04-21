"use client";

import { useState, useEffect, useMemo } from "react";
import RaceStats from "@/components/zonacrono/dashboard/RaceStats";
import LiveLeaderboard from "@/components/zonacrono/dashboard/LiveLeaderboard";
import FinishLineTicker from "@/components/zonacrono/dashboard/FinishLineTicker";
import CourseProgress from "@/components/zonacrono/dashboard/CourseProgress";
import AthleteModal from "@/components/zonacrono/dashboard/AthleteModal";
import { Athlete, INITIAL_ATHLETES } from "@/lib/mock-race-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MAX_DISTANCE = 42.195;

export default function LiveResultsView() {
  const [athletes, setAthletes] = useState<Athlete[]>(INITIAL_ATHLETES);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [isAnnouncerMode, setIsAnnouncerMode] = useState(false);
  const [raceTimeSecs, setRaceTimeSecs] = useState(3600 + Math.floor(Math.random() * 1800)); // Start at ~1h+

  // Helper to format seconds as HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setRaceTimeSecs(prev => prev + 1);
      
      setAthletes(prev => prev.map(athlete => {
        if (athlete.status === 'Finished') return athlete;

        // Randomly update position/checkpoints
        const randomProgress = Math.random() * 0.05; // ~50m progress
        const newDistance = Math.min(MAX_DISTANCE, athlete.lastCheckpoint + randomProgress);
        
        let newStatus: Athlete['status'] = athlete.status;
        let finalTime = athlete.totalTime;
        
        if (newDistance >= MAX_DISTANCE) {
          newStatus = 'Finished';
          finalTime = formatTime(raceTimeSecs);
          toast.success(`¡NUEVA LLEGADA! ${athlete.name} ha cruzado la meta con un tiempo de ${finalTime}`, {
            duration: 5000,
          });
        }

        // Calculate pace (randomly fluctuates)
        const paceMin = 3.8 + Math.random() * 0.5;
        const paceSec = Math.floor((paceMin % 1) * 60);
        const paceStr = `${Math.floor(paceMin)}:${paceSec.toString().padStart(2, "0")}`;

        return {
          ...athlete,
          lastCheckpoint: newDistance,
          status: newStatus,
          totalTime: newStatus === 'Finished' ? finalTime : formatTime(raceTimeSecs - (Math.random() * 60)),
          pace: paceStr
        };
      }));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [raceTimeSecs]);

  // Derived stats
  const stats = useMemo(() => {
    const finished = athletes.filter(a => a.status === 'Finished');
    const leader = [...athletes].sort((a, b) => b.lastCheckpoint - a.lastCheckpoint)[0];
    const avgDist = athletes.reduce((acc, a) => acc + a.lastCheckpoint, 0) / athletes.length;
    
    return {
      total: athletes.length,
      finishedCount: finished.length,
      leaderDistance: leader.lastCheckpoint,
      averageDistance: avgDist,
      finishersList: finished.sort((a, b) => {
          return (a.lastCheckpointTime || 0) - (b.lastCheckpointTime || 0);
      }).slice(0, 10)
    };
  }, [athletes]);

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 transition-all ${isAnnouncerMode ? 'scale-[1.02] origin-top' : ''}`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-primary animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Flujo de Datos en Vivo</span>
          </div>
          <h2 className="font-satoshi text-3xl font-black uppercase tracking-tight md:text-4xl italic">
            Panel de <span className="text-primary underline decoration-primary/20 underline-offset-8">Control</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-muted p-3 border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] w-full md:w-auto justify-between md:justify-start">
          <Label htmlFor="announcer-mode" className="font-mono text-[10px] uppercase cursor-pointer font-bold">
            Modo Locutor {isAnnouncerMode ? '(ON)' : '(OFF)'}
          </Label>
          <Switch 
            id="announcer-mode" 
            checked={isAnnouncerMode} 
            onCheckedChange={setIsAnnouncerMode}
          />
        </div>
      </div>

      {/* Top Stats */}
      <div className="border-t-2 border-border pt-8">
        <RaceStats 
          elapsedTime={formatTime(raceTimeSecs)}
          totalParticipants={stats.total}
          finishedCount={stats.finishedCount}
          leaderDistance={stats.leaderDistance}
          temp={24}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border-2 border-border bg-card shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)]">
        <div className="lg:col-span-3">
           <LiveLeaderboard athletes={athletes} onSelectAthlete={setSelectedAthlete} />
        </div>
        <div className="lg:col-span-1 border-l-2 border-border">
          <FinishLineTicker finishers={stats.finishersList} />
        </div>
      </div>

      {/* Progress Grid */}
      <div className="mt-0">
        <CourseProgress 
          maxDistance={MAX_DISTANCE}
          leaderDistance={stats.leaderDistance}
          averageDistance={stats.averageDistance}
        />
      </div>

      {/* Metadata */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-y-2 border-dashed border-border/50 font-mono text-[9px] text-muted-foreground uppercase">
         <div className="flex flex-wrap justify-center md:justify-start gap-4">
           <span>Protocolo: RFID_96BIT_GEN2</span>
           <span>Antenas: 8/8 ONLINE</span>
           <span>Sincronización: 100%</span>
         </div>
         <div>
           Zonacrono Engine v2.4.0-STABLE
         </div>
      </div>

      <AthleteModal 
        athlete={selectedAthlete}
        isOpen={!!selectedAthlete}
        onClose={() => setSelectedAthlete(null)}
      />
    </div>
  );
}

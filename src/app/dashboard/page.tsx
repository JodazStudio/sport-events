"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/apex/Navbar";
import Footer from "@/components/apex/Footer";
import RaceStats from "@/components/apex/dashboard/RaceStats";
import LiveLeaderboard from "@/components/apex/dashboard/LiveLeaderboard";
import FinishLineTicker from "@/components/apex/dashboard/FinishLineTicker";
import CourseProgress from "@/components/apex/dashboard/CourseProgress";
import AthleteModal from "@/components/apex/dashboard/AthleteModal";
import { Athlete, INITIAL_ATHLETES } from "@/lib/mock-race-data";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Using sonner as it's common in newer setups

const MAX_DISTANCE = 42.195;

export default function DashboardPage() {
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
    <div className={`min-h-screen bg-background text-foreground transition-all duration-500 ${isAnnouncerMode ? 'scale-[1.02] origin-top' : ''}`}>
      <Navbar />
      
      <main className="mx-auto px-4 py-8 mt-16 max-w-7xl">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 bg-primary animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Live Data Stream</span>
            </div>
            <h1 className="font-satoshi text-4xl font-black uppercase tracking-tight md:text-5xl italic">
              Panel de <span className="text-primary underline decoration-primary/20 underline-offset-8">Control</span>
            </h1>
          </div>

          <div className="flex items-center space-x-2 bg-muted p-3 border">
            <Switch 
              id="announcer-mode" 
              checked={isAnnouncerMode} 
              onCheckedChange={setIsAnnouncerMode}
            />
            <Label htmlFor="announcer-mode" className="font-mono text-[10px] uppercase cursor-pointer">
              Modo Locutor {isAnnouncerMode ? '(ON)' : '(OFF)'}
            </Label>
          </div>
        </div>

        {/* Top Stats */}
        <div className="mb-px">
          <RaceStats 
            elapsedTime={formatTime(raceTimeSecs)}
            totalParticipants={stats.total}
            finishedCount={stats.finishedCount}
            leaderDistance={stats.leaderDistance}
            temp={24}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 border-b border-border">
          <div className="lg:col-span-3">
             <LiveLeaderboard athletes={athletes} onSelectAthlete={setSelectedAthlete} />
          </div>
          <div className="lg:col-span-1 border-l">
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

        {/* Disclaimer / Technical Metadata */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-y border-dashed border-muted-foreground/30 font-mono text-[9px] text-muted-foreground uppercase">
           <div className="flex gap-4">
             <span>Protocol: RFID_96BIT_GEN2</span>
             <span>Antenna Status: 8/8 ONLINE</span>
             <span>Data Sync: 100%</span>
           </div>
           <div>
             Apex Racing Live Engine v2.4.0-STABLE
           </div>
        </div>
      </main>

      <Footer />

      <AthleteModal 
        athlete={selectedAthlete}
        isOpen={!!selectedAthlete}
        onClose={() => setSelectedAthlete(null)}
      />
    </div>
  );
}

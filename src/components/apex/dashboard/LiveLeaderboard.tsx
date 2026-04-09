"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trophy } from "lucide-react";
import { Athlete, getCountryFlag } from "@/lib/mock-race-data";

interface LiveLeaderboardProps {
  athletes: Athlete[];
  onSelectAthlete: (athlete: Athlete) => void;
}

const LiveLeaderboard = ({ athletes, onSelectAthlete }: LiveLeaderboardProps) => {
  const [search, setSearch] = useState("");

  const filtered = athletes
    .filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.bib.includes(search))
    .sort((a, b) => {
      if (a.status === "Finished" && b.status !== "Finished") return -1;
      if (a.status !== "Finished" && b.status === "Finished") return 1;
      return (b.lastCheckpoint || 0) - (a.lastCheckpoint || 0);
    });

  return (
    <div className="flex flex-col h-full bg-card border">
      <div className="p-4 border-b flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h3 className="font-satoshi text-sm font-black uppercase tracking-tight">Clasificación en Vivo</h3>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o BIB..."
            className="pl-9 h-9 font-mono text-xs bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center font-mono text-[10px] uppercase">Pos</TableHead>
              <TableHead className="w-12 text-center font-mono text-[10px] uppercase">BIB</TableHead>
              <TableHead className="font-mono text-[10px] uppercase">Atleta</TableHead>
              <TableHead className="font-mono text-[10px] uppercase">Categoría</TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase">Paso (km)</TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase">Ritmo</TableHead>
              <TableHead className="text-right font-mono text-[10px] uppercase">Tiempo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((athlete, index) => (
              <TableRow 
                key={athlete.bib} 
                className="cursor-pointer hover:bg-muted/50 transition-colors border-l-2 border-transparent hover:border-primary group"
                onClick={() => onSelectAthlete(athlete)}
              >
                <TableCell className="text-center font-mono text-sm font-bold">
                  {index + 1}
                </TableCell>
                <TableCell className="text-center font-mono text-xs text-muted-foreground">
                  #{athlete.bib}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{getCountryFlag(athlete.country)}</span>
                    <span className="font-satoshi font-black text-sm uppercase group-hover:text-primary transition-colors">
                      {athlete.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10px] font-mono leading-none py-0 h-5 border-primary/20 text-primary">
                    {athlete.category} · {athlete.gender}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm font-bold text-foreground">
                  {athlete.lastCheckpoint.toFixed(1)} <span className="text-[10px] text-muted-foreground uppercase">km</span>
                </TableCell>
                <TableCell className="text-right font-mono text-sm text-muted-foreground italic">
                  {athlete.pace || '--:--'}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`font-mono text-sm font-bold ${athlete.status === 'Finished' ? 'text-green-500' : 'text-primary'}`}>
                    {athlete.totalTime || '00:00:00'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LiveLeaderboard;

"use client";
import { Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, AnimatedContent } from "@/components/ui";


import { useState } from "react";
import { Search, Trophy } from "lucide-react";
import type { ResultEntry } from "./types";

interface ResultsCenterProps {
  results?: ResultEntry[];
  distances?: string[];
  categories?: string[];
  visible?: boolean;
}

export const ResultsCenter = ({ results, distances, categories, visible = false }: ResultsCenterProps) => {
  const [search, setSearch] = useState("");
  const [filterDistance, setFilterDistance] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  if (!visible) return null;

  const filtered = results?.filter((r) => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.dorsal.includes(search);
    const matchDist = filterDistance === "all" || r.distance === filterDistance;
    const matchCat = filterCategory === "all" || r.category === filterCategory;
    return matchSearch && matchDist && matchCat;
  });

  return (
    <section id="resultados" className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedContent>
          <h2 className="font-satoshi font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-foreground mb-12 text-center italic uppercase tracking-tighter">
            Resultados
          </h2>
        </AnimatedContent>

        {/* Search + Filters */}
        <AnimatedContent delay={0.2} distance={30}>
          <div className="max-w-4xl mx-auto mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o dorsal..."
                className="pl-10 bg-secondary/50 border-2 border-border text-foreground font-satoshi rounded-none focus:border-ember transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {distances && distances.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterDistance("all")}
                  className={`px-4 py-2 cursor-pointer rounded-none text-xs font-satoshi font-bold uppercase tracking-widest transition-all border-2 ${
                    filterDistance === "all" 
                      ? "bg-ember border-ember text-ember-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                      : "bg-secondary border-border text-muted-foreground hover:border-ember/50 hover:text-foreground"
                  }`}
                >
                  Todas
                </button>
                {distances.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilterDistance(d)}
                    className={`px-4 py-2 cursor-pointer rounded-none text-xs font-satoshi font-bold uppercase tracking-widest transition-all border-2 ${
                      filterDistance === d 
                        ? "bg-ember border-ember text-ember-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                        : "bg-secondary border-border text-muted-foreground hover:border-ember/50 hover:text-foreground"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>
        </AnimatedContent>

        {/* Results table */}
        <AnimatedContent delay={0.4}>
          {filtered && filtered.length > 0 ? (
            <div className="max-w-4xl mx-auto overflow-x-auto border-2 border-border bg-card">
              <Table className="min-w-[800px]">
                <TableHeader>
                  <TableRow className="border-border bg-secondary/50">
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">#</TableHead>
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">Dorsal</TableHead>
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">Nombre</TableHead>
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">Distancia</TableHead>
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">Categoría</TableHead>
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">Pos. Cat.</TableHead>
                    <TableHead className="text-ember font-satoshi font-black italic uppercase text-base sm:text-lg">Tiempo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r, idx) => (
                    <TableRow key={`${r.dorsal}-${idx}`} className="border-border hover:bg-muted/30 transition-colors">
                      <TableCell className="font-satoshi font-black text-foreground text-lg sm:text-xl italic">{r.generalPlace}</TableCell>
                      <TableCell className="font-satoshi text-foreground font-bold">{r.dorsal}</TableCell>
                      <TableCell className="font-satoshi text-foreground font-medium uppercase tracking-tight">{r.name}</TableCell>
                      <TableCell className="font-satoshi text-muted-foreground text-[10px] sm:text-xs uppercase font-bold">{r.distance}</TableCell>
                      <TableCell className="font-satoshi text-muted-foreground text-[10px] sm:text-xs uppercase font-bold">{r.category}</TableCell>
                      <TableCell className="font-satoshi font-black text-foreground text-lg sm:text-xl italic">{r.categoryPlace}</TableCell>
                      <TableCell className="font-satoshi font-black text-ember text-xl sm:text-2xl italic">{r.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-satoshi font-medium uppercase tracking-widest text-sm">
                {results ? "No se encontraron resultados." : "Los resultados serán publicados al finalizar el evento."}
              </p>
            </div>
          )}
        </AnimatedContent>
      </div>
    </section>
  );
};


"use client";

import { 
  Users, 
  Clock, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

export function OverviewView() {
  const kpis = [
    {
      title: "Inscripciones Totales",
      value: "250 / 500",
      description: "Inscritos vs Capacidad Total",
      icon: Users,
      progress: 50,
      detail: "Crecimiento +12% esta semana",
      color: "border-primary"
    },
    {
      title: "Pagos Pendientes",
      value: "15",
      description: "Pagos por revisar",
      icon: Clock,
      status: "critical",
      detail: "Urgente: 5 con más de 24h",
      color: "border-destructive animate-pulse"
    },
    {
      title: "Etapa Actual",
      value: "Preventa 1",
      description: "128 cupos restantes",
      icon: MapPin,
      detail: "Precio de preventa activo",
      color: "border-orange-500"
    },
    {
      title: "Recaudación Estimada",
      value: "$12,500.00",
      description: "Consolidado: 457,250 VES",
      icon: DollarSign,
      detail: "Calculado a tasa BCV actual",
      color: "border-green-600"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2">
          Resumen de <span className="text-primary">Dashboard</span>
        </h2>
        <p className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-wider">
          Métricas de rendimiento en tiempo real
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className={`rounded-none border-2 ${kpi.color} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] transition-all duration-200 bg-card`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-balance">
              <CardTitle className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-black italic uppercase tracking-tighter mb-1">
                {kpi.value}
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-mono mb-4">
                {kpi.description}
              </p>
              
              {kpi.progress !== undefined && (
                <div className="space-y-2 mb-4">
                  <Progress value={kpi.progress} className="h-1 rounded-none" />
                </div>
              )}

              {kpi.status === "critical" && (
                <div className="flex items-center gap-1 text-destructive mb-4">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
                  <span className="font-mono text-[9px] uppercase font-bold">Acción Requerida</span>
                </div>
              )}

              <div className="pt-2 border-t border-dashed flex items-center gap-2">
                <TrendingUp className="size-3 text-muted-foreground" />
                <span className="font-mono text-[9px] uppercase text-muted-foreground lg:truncate">
                  {kpi.detail}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Secondary Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 rounded-none border-2 border-black dark:border-white p-4 md:p-6 bg-muted/20 border-dashed overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="size-4 text-primary" />
              <h3 className="font-black italic uppercase text-lg">Logs de la Plataforma</h3>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-start md:items-center gap-4 py-2 border-b border-border/50 font-mono text-[10px] uppercase last:border-0">
                  <span className="text-muted-foreground whitespace-nowrap">12:34 PM</span>
                  <span className="px-1 bg-green-500/10 text-green-600 font-bold whitespace-nowrap">ÉXITO</span>
                  <span className="line-clamp-1">Pago aprobado para ID: AB123456</span>
                </div>
              ))}
            </div>
        </Card>

        <Card className="col-span-1 rounded-none border-2 border-black dark:border-white p-4 md:p-6 bg-primary/5 border-dashed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
           <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="size-4 text-primary" />
              <h3 className="font-black italic uppercase text-lg">Estado de Sincronización</h3>
            </div>
            <div className="space-y-4 font-mono text-[10px] uppercase text-muted-foreground">
              <div className="flex justify-between">
                <span>Base de Datos</span>
                <span className="text-primary font-bold">OK</span>
              </div>
              <div className="flex justify-between">
                <span>Akomo API</span>
                <span className="text-primary font-bold">OK</span>
              </div>
              <div className="flex justify-between">
                <span>Almacenamiento</span>
                <span className="text-primary font-bold">OK</span>
              </div>
            </div>
        </Card>
      </div>
    </div>
  );
}


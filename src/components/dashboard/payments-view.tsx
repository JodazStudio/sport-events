"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  DollarSign,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { PaymentDrawer } from "./payment-drawer";
import { useRegistrations } from "@/hooks/queries/useRegistrations";
import { format } from "date-fns";

interface PaymentsViewProps {
  eventId: string;
}

export function PaymentsView({ eventId }: PaymentsViewProps) {
  const { data, isLoading, error } = useRegistrations(eventId);
  const [selectedReg, setSelectedReg] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <span className="font-mono text-sm uppercase font-black animate-pulse">Cargando pagos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-destructive">
        <AlertCircle className="w-12 h-12" />
        <span className="font-black uppercase tracking-tight">Error al cargar pagos</span>
      </div>
    );
  }

  const registrations = data?.registrations || [];
  
  // Filter registrations that have payments OR are REPORTED (should have payments)
  const payments = registrations.filter((reg: any) => reg.status === 'REPORTED' || reg.payment);

  const filteredPayments = payments.filter((reg: any) => {
    const matchesSearch = 
      `${reg.first_name} ${reg.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.payment?.reference_number?.includes(searchTerm);
    
    const matchesStatus = statusFilter === "ALL" || reg.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Stats
  const approvedTotal = payments
    .filter((r: any) => r.status === 'APPROVED' && r.payment)
    .reduce((sum: number, r: any) => sum + Number(r.payment.amount_usd), 0);
  
  const pendingCount = payments.filter((r: any) => r.status === 'REPORTED').length;
  const rejectedCount = payments.filter((r: any) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2">
            Control de <span className="text-primary">Finanzas</span>
          </h2>
          <p className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-wider">
            Valida los ingresos y concilia los pagos reportados por los atletas
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border-2 border-black dark:border-white bg-white dark:bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="size-4 text-green-600" />
            <span className="font-mono text-[10px] uppercase font-black text-muted-foreground">Total Recaudado</span>
          </div>
          <div className="text-2xl font-black italic">${approvedTotal.toFixed(2)}</div>
        </div>
        <div className="p-4 border-2 border-black dark:border-white bg-white dark:bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="size-4 text-primary" />
            <span className="font-mono text-[10px] uppercase font-black text-muted-foreground">Por Validar</span>
          </div>
          <div className="text-2xl font-black italic">{pendingCount} <span className="text-sm font-mono uppercase not-italic">Pagos</span></div>
        </div>
        <div className="p-4 border-2 border-black dark:border-white bg-white dark:bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="size-4 text-destructive" />
            <span className="font-mono text-[10px] uppercase font-black text-muted-foreground">Rechazados</span>
          </div>
          <div className="text-2xl font-black italic">{rejectedCount} <span className="text-sm font-mono uppercase not-italic">Pagos</span></div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por atleta o referencia..." 
            className="pl-10 rounded-none border-2 border-black dark:border-white focus-visible:ring-primary focus-visible:border-primary font-mono text-xs uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="h-10 px-4 rounded-none border-2 border-black dark:border-white bg-background font-black uppercase text-xs italic tracking-tight shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">Todos los Estados</option>
          <option value="REPORTED">Reportados</option>
          <option value="APPROVED">Aprobados</option>
          <option value="REJECTED">Rechazados</option>
          <option value="PENDING">Pendientes de Reporte</option>
        </select>
      </div>

      <div className="border-2 border-border bg-card shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="bg-muted/50 border-b-2">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">
                  <div className="flex items-center gap-1">
                    Atleta <ArrowUpDown className="size-3" />
                  </div>
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Categoría</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4 text-right">Monto (USD)</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4 text-right">Monto (VES)</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Referencia</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4 text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center font-mono uppercase text-muted-foreground">
                    No se encontraron registros de pagos
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayments.map((reg: any) => (
                  <TableRow 
                    key={reg.id} 
                    className="border-b transition-all duration-200 hover:bg-muted/30 cursor-pointer active:scale-[0.99]"
                    onClick={() => setSelectedReg(reg)}
                  >
                    <TableCell className="py-4">
                      <div className="flex flex-col">
                        <span className="font-black italic uppercase tracking-tight text-sm">{reg.first_name} {reg.last_name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground tracking-tighter">{reg.dni}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="rounded-none font-mono text-[9px] uppercase border-border">
                        {reg.category?.name || "Sin categoría"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-bold py-4 text-xs text-right">
                      ${reg.payment?.amount_usd || "0.00"}
                    </TableCell>
                    <TableCell className="font-mono font-bold py-4 text-xs text-primary text-right">
                      {reg.payment?.amount_ves ? `${reg.payment.amount_ves} VES` : "N/A"}
                    </TableCell>
                    <TableCell className="font-mono py-4 text-[11px] font-bold tracking-widest uppercase">
                      {reg.payment?.reference_number || "S/N"}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="flex justify-center">
                        {reg.status === "REPORTED" && (
                            <Badge className="rounded-none bg-primary text-primary-foreground font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                                <Clock className="size-3" /> Reportado
                            </Badge>
                        )}
                        {reg.status === "APPROVED" && (
                            <Badge className="rounded-none bg-green-600 text-white font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                                <CheckCircle className="size-3" /> Aprobado
                            </Badge>
                        )}
                        {reg.status === "REJECTED" && (
                            <Badge className="rounded-none bg-destructive text-white font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                                <AlertCircle className="size-3" /> Rechazado
                            </Badge>
                        )}
                        {reg.status === "PENDING" && (
                            <Badge className="rounded-none bg-yellow-500 text-black font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                                <AlertTriangle className="size-3" /> Pendiente
                            </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase text-muted-foreground px-2">
          <span>Mostrando {filteredPayments.length} de {payments.length} pagos</span>
      </div>

      <PaymentDrawer 
        registration={selectedReg} 
        isOpen={!!selectedReg} 
        onClose={() => setSelectedReg(null)} 
        eventId={eventId}
      />
    </div>
  );
}



"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpDown,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PaymentDrawer } from "./payment-drawer";

interface Payment {
  id: string;
  athleteName: string;
  athleteId: string;
  category: string;
  expectedUsd: string;
  reportedVes: string;
  bcvRate: string;
  reference: string;
  status: "Pending" | "Reported" | "Approved" | "Rejected";
  date: string;
}

const payments: Payment[] = [
  { 
    id: "PAY-001", 
    athleteName: "Andrés Rodríguez", 
    athleteId: "V-12345678",
    category: "Master A Masculino", 
    expectedUsd: "35.00", 
    reportedVes: "1,278.90", 
    bcvRate: "36.54",
    reference: "987654321", 
    status: "Reported",
    date: "2024-04-09"
  },
  { 
    id: "PAY-002", 
    athleteName: "Mariana Silva", 
    athleteId: "V-87654321",
    category: "Libre Femenino", 
    expectedUsd: "25.00", 
    reportedVes: "913.50", 
    bcvRate: "36.54",
    reference: "123456789", 
    status: "Approved",
    date: "2024-04-08"
  },
  { 
    id: "PAY-003", 
    athleteName: "Juan Pérez", 
    athleteId: "V-11223344",
    category: "Master B Masculino", 
    expectedUsd: "35.00", 
    reportedVes: "1,278.90", 
    bcvRate: "36.54",
    reference: "555666777", 
    status: "Pending",
    date: "2024-04-09"
  },
];

export default function PaymentsView() {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic mb-2">
            Aprobación de <span className="text-primary">Pagos</span>
          </h2>
          <p className="text-muted-foreground font-mono text-[10px] md:text-xs uppercase tracking-wider">
            Revisa y valida los pagos de inscripción de los atletas
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por atleta o referencia..." 
            className="pl-10 rounded-none border-2 border-border focus-visible:ring-primary focus-visible:border-primary font-mono text-xs uppercase"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="rounded-none border-2 border-border font-black uppercase italic tracking-tight w-full sm:w-auto">
          <Filter className="mr-2 size-4" /> Filtrar
        </Button>
      </div>

      <div className="border-2 border-border bg-card shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader className="bg-muted/50 border-b-2">
              <TableRow className="hover:bg-transparent border-0">
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Atleta <ArrowUpDown className="size-3" />
                  </div>
                </TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Categoría</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Esperado (USD)</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Reportado (VES)</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4">Referencia</TableHead>
                <TableHead className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground py-4 text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow 
                  key={payment.id} 
                  className="border-b transition-all duration-200 hover:bg-muted/30 cursor-pointer active:scale-[0.99]"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-black italic uppercase tracking-tight text-sm">{payment.athleteName}</span>
                      <span className="font-mono text-[10px] text-muted-foreground tracking-tighter">{payment.athleteId}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="rounded-none font-mono text-[9px] uppercase border-border">
                      {payment.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-bold py-4 text-xs">${payment.expectedUsd}</TableCell>
                  <TableCell className="font-mono font-bold py-4 text-xs text-primary">{payment.reportedVes} VES</TableCell>
                  <TableCell className="font-mono py-4 text-[11px] font-bold tracking-widest">{payment.reference}</TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex justify-center">
                      {payment.status === "Reported" && (
                          <Badge className="rounded-none bg-primary text-primary-foreground font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                              <Clock className="size-3" /> Reportado
                          </Badge>
                      )}
                      {payment.status === "Approved" && (
                          <Badge className="rounded-none bg-green-600 text-white font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                              <CheckCircle className="size-3" /> Aprobado
                          </Badge>
                      )}
                      {payment.status === "Pending" && (
                          <Badge className="rounded-none bg-yellow-500 text-black font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 flex items-center gap-1">
                              <AlertTriangle className="size-3" /> Pendiente
                          </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase text-muted-foreground px-2">
          <span>Mostrando 3 de 152 pagos</span>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="rounded-none h-8 px-4 font-black italic flex-1 sm:flex-initial">Anterior</Button>
            <Button variant="outline" size="sm" className="rounded-none h-8 px-4 font-black italic border-primary text-primary flex-1 sm:flex-initial">Siguiente</Button>
          </div>
      </div>

      <PaymentDrawer 
        payment={selectedPayment} 
        isOpen={!!selectedPayment} 
        onClose={() => setSelectedPayment(null)} 
      />
    </div>
  );
}

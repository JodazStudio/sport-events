"use client";

import Image from "next/image";
import { 
  CheckCircle2, 
  XCircle, 
  Info, 
  User as UserIcon, 
  Hash, 
  Calendar,
  DollarSign
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"; // Using Sheet for the right-side slide-out drawer
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

interface PaymentDrawerProps {
  payment: Payment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDrawer({ payment, isOpen, onClose }: PaymentDrawerProps) {
  if (!payment) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 rounded-none border-l-4 border-primary bg-background shadow-[-10px_0px_30px_rgba(0,0,0,0.1)]">
        <SheetHeader className="p-6 bg-muted/30 border-b">
          <div className="flex items-center justify-between mb-4">
            <Badge className={`rounded-none font-mono text-[9px] uppercase tracking-widest px-3 py-1 ${
              payment.status === "Approved" ? "bg-green-600" : 
              payment.status === "Pending" ? "bg-yellow-500" : "bg-primary"
            }`}>
              {payment.status === "Approved" ? "Aprobado" : 
               payment.status === "Pending" ? "Pendiente" : "Reportado"}
            </Badge>
            <span className="font-mono text-[10px] uppercase text-muted-foreground">{payment.date}</span>
          </div>
          <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter">
            Revisar <span className="text-primary">Pago</span>
          </SheetTitle>
          <SheetDescription className="font-mono text-[9px] uppercase tracking-widest">
            ID de Transacción: {payment.id}
          </SheetDescription>
        </SheetHeader>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Athlete Info */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <UserIcon className="size-4" />
              <h4 className="font-black uppercase italic text-sm tracking-tight">Detalles del Atleta</h4>
            </div>
            <div className="bg-muted/30 p-4 border border-border space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">Nombre Completo</span>
                <span className="font-bold uppercase italic">{payment.athleteName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">Cédula / ID</span>
                <span className="font-mono font-bold tracking-tighter text-sm">{payment.athleteId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-muted-foreground">Categoría</span>
                <Badge variant="outline" className="rounded-none font-mono text-[9px] uppercase">{payment.category}</Badge>
              </div>
            </div>
          </section>

          {/* Financial Breakdown */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <DollarSign className="size-4" />
              <h4 className="font-black uppercase italic text-sm tracking-tight">Desglose Financiero</h4>
            </div>
            <div className="space-y-3 font-mono text-[11px] uppercase p-4 border-2 border-dashed border-border">
               <div className="flex justify-between">
                <span className="text-muted-foreground">Monto Esperado (USD)</span>
                <span className="font-bold">${payment.expectedUsd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasa BCV Aplicada</span>
                <span>{payment.bcvRate} VES</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="text-muted-foreground font-bold">Reportado (VES)</span>
                <span className="text-xl font-black italic text-primary">{payment.reportedVes} VES</span>
              </div>
              <div className="flex justify-center items-center gap-2 py-2 bg-muted/50 mt-2 border border-border font-mono text-[10px] tracking-widest font-bold">
                 REF: {payment.reference}
              </div>
            </div>
          </section>

          {/* Receipt Image */}
          <section className="space-y-4 pb-8">
            <div className="flex items-center gap-3 text-primary">
              <Info className="size-4" />
              <h4 className="font-black uppercase italic text-sm tracking-tight">Comprobante de Transferencia</h4>
            </div>
            <div className="relative aspect-[3/4] w-full border-2 border-border bg-muted overflow-hidden group">
                <Image 
                    src="/bank__transfer_receipt_placeholder_1775751131037.png" 
                    alt="Comprobante Bancario" 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button variant="outline" className="rounded-none bg-white font-bold uppercase italic text-xs">Ver Pantalla Completa</Button>
                </div>
            </div>
          </section>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t grid grid-cols-2 gap-4">
            <Button className="btn-mechanical rounded-none bg-destructive hover:bg-destructive/90 text-white border-0 py-6">
                <XCircle className="mr-2 size-5" /> RECHAZAR
            </Button>
            <Button className="btn-mechanical rounded-none bg-green-600 hover:bg-green-700 text-white border-0 py-6" style={{boxShadow: '4px 4px 0px 0px #15803d'}}>
                <CheckCircle2 className="mr-2 size-5" /> APROBAR
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { toast } from "sonner";

interface ReportPaymentFormProps {
  registrationId: string;
  priceUsd: number;
  bcvRate: number;
}

export function ReportPaymentForm({
  registrationId,
  priceUsd,
  bcvRate,
}: ReportPaymentFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const priceVes = (priceUsd * bcvRate).toLocaleString("es-VE", {
    minimumFractionDigits: 2,
  });

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Adjunta el comprobante de pago.");
      return;
    }
    if (!referenceNumber.trim()) {
      toast.error("Ingresa el número de referencia.");
      return;
    }

    try {
      setSubmitting(true);
      toast.info("Enviando comprobante...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("reference_number", referenceNumber.trim());
      formData.append("amount_usd", String(priceUsd));
      formData.append("amount_ves", String(priceUsd * bcvRate));
      formData.append("exchange_rate_bcv", String(bcvRate));

      const res = await fetch(`/api/registrations/${registrationId}/report`, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("¡Pago reportado exitosamente!");
        router.refresh();
      } else {
        toast.error(result.error || "Error al reportar el pago.");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error de conexión.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="md:col-span-2 border-4 border-black dark:border-white bg-card p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
      <h3 className="font-satoshi text-xl font-black uppercase italic tracking-tight mb-2 flex items-center gap-2 text-foreground">
        <Upload className="w-5 h-5 text-primary" /> Reportar Pago
      </h3>

      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 border-2 border-yellow-500 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
        <p className="text-[10px] font-black text-yellow-700 dark:text-yellow-400 uppercase leading-relaxed tracking-tight">
          Tienes hasta las 11:59 PM de hoy para reportar tu pago. Si no lo
          reportas, tu reserva será cancelada automáticamente.
        </p>
      </div>

      {/* Amount info */}
      <div className="mb-6 p-4 border-2 border-black dark:border-white bg-primary/5 flex flex-col items-center gap-1">
        <span className="font-mono text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">
          Monto a Pagar
        </span>
        <span className="text-3xl font-black italic text-primary">
          ${priceUsd} USD
        </span>
        <span className="text-sm font-bold text-foreground">
          ~ {priceVes} VES
        </span>
        <span className="font-mono text-[9px] uppercase text-muted-foreground">
          Tasa BCV: {bcvRate} VES
        </span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* File Upload */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Comprobante (Imagen) *
          </label>
          <div className="relative border-2 border-dashed border-black dark:border-white hover:border-primary/50 transition-colors p-8 text-center cursor-pointer group bg-muted/10">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              disabled={submitting}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-primary" />
                <span className="text-xs font-bold truncate max-w-[200px] italic">
                  {file.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-[10px] uppercase font-mono font-bold text-muted-foreground">
                  Subir Comprobante
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Reference Number */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
            Número de Referencia *
          </label>
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Ej: 987654"
            disabled={submitting}
            className="flex h-12 w-full border-2 border-black dark:border-white bg-background px-4 py-2 text-sm font-mono font-bold placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-none border-2 border-black dark:border-white bg-primary text-white font-black uppercase text-xs italic py-6 px-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all h-auto"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <CheckCircle className="h-4 w-4 mr-2" />
          )}
          Reportar Pago
        </Button>
      </div>
    </div>
  );
}

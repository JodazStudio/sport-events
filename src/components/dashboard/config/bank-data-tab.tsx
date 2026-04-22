"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { FormInput } from "@/components/ui/forms";

export function BankDataTab() {
  const { control } = useFormContext();
  return (
    <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
      <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
        <CardTitle className="font-satoshi font-black italic uppercase text-xl">Datos Bancarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <p className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
          Estos datos se mostrarán a los atletas durante el proceso de pago.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            control={control}
            name="payment_info.bank_name"
            label="Nombre del Banco"
            placeholder="Ej: Bancamiga"
          />
          <FormInput
            control={control}
            name="payment_info.phone_number"
            label="Número de Teléfono (Pago Móvil)"
            placeholder="Ej: 0424-0000000"
          />
          <FormInput
            control={control}
            name="payment_info.id_number"
            label="Cédula / RIF"
            placeholder="Ej: V-12345678"
          />
          <FormInput
            control={control}
            name="payment_info.account_number"
            label="Número de Cuenta (Opcional)"
            placeholder="0123..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

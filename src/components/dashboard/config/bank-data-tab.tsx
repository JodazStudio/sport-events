"use client";
 
import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { FormInput, FormCombobox } from "@/components/ui/forms";
import { BANK_OPTIONS, getBankName } from "@/lib/banks";
import { AlertCircleIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function BankDataTab() {
  const { control, setValue, formState: { errors } } = useFormContext();

  // Check if there are errors in this tab
  const hasErrors = errors.payment_info;

  return (
    <Card className="border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] bg-card">
      <CardHeader className="bg-muted/30 border-b-2 border-black dark:border-white">
        <CardTitle className="font-satoshi font-black italic uppercase text-xl flex items-center justify-between">
          Datos Bancarios
          {hasErrors && (
            <span className="text-destructive flex items-center gap-1 text-xs font-bold animate-pulse">
              <AlertCircleIcon className="w-4 h-4" />
              DATOS INCOMPLETOS
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <Alert className="bg-blue-500/10 border-blue-500/50 text-blue-500 rounded-none mb-6">
          <InfoIcon className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-xs uppercase font-bold italic">
            Configura los datos para el Pago Móvil o Transferencia que verán los atletas.
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCombobox
            control={control}
            name="payment_info.bank_code"
            label="Banco"
            placeholder="Selecciona un banco"
            options={BANK_OPTIONS}
            onSelect={(value) => {
              const bankName = getBankName(value);
              setValue("payment_info.bank_name", bankName);
            }}
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

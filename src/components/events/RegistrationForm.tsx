"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Timer, 
  ArrowLeft, 
  User, 
  CreditCard, 
  ShirtIcon, 
  CheckCircle, 
  CalendarIcon,
  Upload,
  Loader2,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib";
import { Input, Label, RadioGroup, RadioGroupItem, Button, Calendar, Popover, PopoverContent, PopoverTrigger, Separator } from "@/components/ui";
import { toast } from "sonner";

// --- Types ---
interface EventData {
  id: string;
  name: string;
  slug: string;
  has_inventory: boolean;
  banner_url?: string;
  description?: string;
}

interface RegistrationStage {
  id: string;
  name: string;
  price_usd: number;
  total_capacity: number;
  used_capacity: number;
}

interface RegistrationFormProps {
  event: EventData;
  activeStage: RegistrationStage;
  bcvRate: number;
  slug: string;
}

// --- Mock/Assumption: Image Upload Helper ---
const uploadImage = async (file: File): Promise<string> => {
  // In a real scenario, this would post to Cloudinary/S3
  // Returning a fake URL for now to show the flow
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`https://res.cloudinary.com/dummy/image/upload/v12345/receipts/${file.name}`);
    }, 1500);
  });
};

export function RegistrationForm({ event, activeStage, bcvRate, slug }: RegistrationFormProps) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    fechaNacimiento: undefined as Date | undefined,
    sexo: "",
    shirt_size: "",
    payment_reference: "",
    payment_receipt: null as File | null,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (!formData.nombre || !formData.apellido || !formData.dni || !formData.email || !formData.fechaNacimiento || !formData.sexo) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (event?.has_inventory && !formData.shirt_size) {
      toast.error("Por favor selecciona tu talla de franela.");
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const submitRegistration = async (withPayment: boolean) => {
    if (withPayment && (!formData.payment_receipt || !formData.payment_reference)) {
      toast.error("Por favor adjunta el comprobante y el número de referencia.");
      return;
    }

    try {
      setSubmitting(true);
      let receipt_url = "";

      if (withPayment && formData.payment_receipt) {
        toast.info("Subiendo comprobante...");
        receipt_url = await uploadImage(formData.payment_receipt);
      }

      const payload = {
        event_id: event?.id,
        stage_id: activeStage?.id,
        first_name: formData.nombre,
        last_name: formData.apellido,
        dni: formData.dni,
        email: formData.email,
        birth_date: formData.fechaNacimiento?.toISOString().split('T')[0],
        gender: formData.sexo,
        shirt_size: formData.shirt_size,
        payment_data: withPayment ? {
          receipt_url,
          reference_number: formData.payment_reference,
          amount_ves: (activeStage?.price_usd || 0) * bcvRate,
          exchange_rate_bcv: bcvRate,
          amount_usd: activeStage?.price_usd
        } : null
      };

      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("¡Inscripción enviada con éxito!");
        router.push(`/status/${result.registration_id}`);
      } else {
        toast.error(result.error || "Ocurrió un error al procesar la inscripción.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error de conexión con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  const priceVes = (activeStage.price_usd * bcvRate).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Timer className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="font-satoshi text-lg font-black uppercase tracking-tight text-foreground italic">
              Zona<span className="text-primary">crono</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-mono text-[10px] uppercase text-muted-foreground leading-none">Paso {step} de 2</span>
              <span className="font-satoshi text-xs font-bold text-primary">{step === 1 ? "Información Personal" : "Pago y Confirmación"}</span>
            </div>
            <Link
              href={`/${slug}`}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Volver al evento</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8 w-full bg-muted h-1.5 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / 2) * 100}%` }}
          />
        </div>

        {/* Title */}
        <div className="mb-10 text-center">
          <h1 className="font-satoshi text-3xl font-black leading-tight text-foreground md:text-5xl italic uppercase tracking-tighter text-balance">
            {event.name}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-muted-foreground font-medium text-sm">
            {activeStage.name} — Inscripción abierta
          </p>
        </div>

        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Athlete Info */}
            <div className="border-2 border-primary/10 bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground italic">
                  Información del Atleta
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre" className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Nombre *
                  </Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Ej: Juan"
                    className="rounded-none border-2 border-border focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido" className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Apellido *
                  </Label>
                  <Input
                    id="apellido"
                    value={formData.apellido}
                    onChange={(e) => handleChange("apellido", e.target.value)}
                    placeholder="Ej: Pérez"
                    className="rounded-none border-2 border-border focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dni" className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Cédula / Pasaporte *
                  </Label>
                  <Input
                    id="dni"
                    value={formData.dni}
                    onChange={(e) => handleChange("dni", e.target.value)}
                    placeholder="V-00000000"
                    className="rounded-none border-2 border-border focus:border-primary font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Correo Electrónico *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="juan@email.com"
                    className="rounded-none border-2 border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    Fecha de Nacimiento *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-none border-2 border-border h-10",
                          !formData.fechaNacimiento && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaNacimiento
                          ? format(formData.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-none border-2 border-black" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.fechaNacimiento}
                        onSelect={(date) => handleChange("fechaNacimiento", date)}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={1920}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Género *</Label>
                  <RadioGroup
                    value={formData.sexo}
                    onValueChange={(v) => handleChange("sexo", v)}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center gap-2 border border-border p-2 flex-1 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="M" id="sexo-m" />
                      <Label htmlFor="sexo-m" className="text-xs uppercase font-bold cursor-pointer">Masculino</Label>
                    </div>
                    <div className="flex items-center gap-2 border border-border p-2 flex-1 cursor-pointer hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="F" id="sexo-f" />
                      <Label htmlFor="sexo-f" className="text-xs uppercase font-bold cursor-pointer">Femenino</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/30 border-l-4 border-primary">
                <p className="text-[10px] font-mono uppercase text-muted-foreground">
                   Nota: Tu categoría será asignada automáticamente en función de tu edad y género al momento de la inscripción.
                </p>
              </div>
            </div>

            {/* Inventory / Shirt Size */}
            {event.has_inventory && (
              <div className="border-2 border-primary/10 bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
                <div className="mb-6 flex items-center gap-3">
                  <ShirtIcon className="h-5 w-5 text-primary" />
                  <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground italic">
                    Talla de Franela
                  </h3>
                </div>
                <RadioGroup
                  value={formData.shirt_size}
                  onValueChange={(v) => handleChange("shirt_size", v)}
                  className="grid grid-cols-3 sm:grid-cols-6 gap-3"
                >
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <div key={size} className="flex flex-col">
                      <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className={cn(
                          "w-full py-3 text-center border-2 font-mono font-bold cursor-pointer transition-all",
                          formData.shirt_size === size 
                            ? "border-primary bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                onClick={handleNextStep}
                variant="mechanical"
                className="bg-primary text-white text-sm uppercase font-black px-12 py-6 border-0"
              >
                Continuar al Pago
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Payment Details */}
            <div className="border-2 border-primary/10 bg-card p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-6 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground italic">
                  Detalles de Pago
                </h3>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Bank Info */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 border border-border">
                    <h4 className="font-mono text-[10px] uppercase font-bold text-muted-foreground mb-3">Datos del Organizador</h4>
                    <div className="space-y-2 font-mono text-xs">
                      <p><span className="text-muted-foreground">BANCO:</span> <span className="font-bold">Bancamiga</span></p>
                      <p><span className="text-muted-foreground">TELÉFONO:</span> <span className="font-bold">0424-777-7777</span></p>
                      <p><span className="text-muted-foreground">CÉDULA:</span> <span className="font-bold">V-12.345.678</span></p>
                    </div>
                  </div>

                  <div className="p-6 border-2 border-black flex flex-col items-center justify-center gap-2 bg-primary/5">
                    <span className="font-mono text-xs uppercase text-muted-foreground">Monto a Reportar</span>
                    <div className="flex flex-col items-center">
                        <span className="text-4xl font-black italic text-primary">${activeStage.price_usd} USD</span>
                        <span className="text-lg font-bold text-foreground">~ {priceVes} VES</span>
                    </div>
                    <span className="font-mono text-[9px] uppercase text-muted-foreground">Tasa BCV: {bcvRate} VES</span>
                  </div>
                </div>

                {/* Proof of Payment */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Comprobante (Imagen) *</Label>
                    <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors p-8 text-center cursor-pointer group">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => handleChange("payment_receipt", e.target.files?.[0])}
                      />
                      {formData.payment_receipt ? (
                        <div className="flex flex-col items-center gap-2">
                          <CheckCircle className="h-8 w-8 text-primary" />
                          <span className="text-xs font-bold truncate max-w-[200px] italic">{formData.payment_receipt.name}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-xs uppercase font-mono text-muted-foreground">Subir Comprobante</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ref" className="font-mono text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Número de Referencia *</Label>
                    <Input
                      id="ref"
                      value={formData.payment_reference}
                      onChange={(e) => handleChange("payment_reference", e.target.value)}
                      placeholder="Ej: 987654"
                      className="rounded-none border-2 border-border focus:border-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-red-50 border-2 border-red-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-700 uppercase leading-relaxed">
                  IMPORTANTE: Tienes hasta las 11:59 PM de hoy para reportar tu pago o esta reserva será cancelada automáticamente.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep(1)}
                className="font-mono text-xs uppercase font-bold text-muted-foreground hover:text-primary order-2 sm:order-1"
                disabled={submitting}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver a información
              </Button>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto order-1 sm:order-2">
                <Button 
                  variant="outline"
                  onClick={() => submitRegistration(false)}
                  disabled={submitting}
                  className="rounded-none border-2 border-black font-black uppercase text-xs italic py-6 px-6 hover:bg-muted"
                >
                  RESERVAR Y PAGAR LUEGO
                </Button>
                <Button 
                  onClick={() => submitRegistration(true)}
                  disabled={submitting}
                  variant="mechanical"
                  className="bg-primary text-white font-black uppercase text-xs italic py-6 px-10 border-0 h-auto"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  REPORTAR PAGO AHORA
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

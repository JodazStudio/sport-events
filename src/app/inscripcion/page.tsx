"use client";

import { useState } from "react";
import Link from "next/link";
import { Timer, ArrowLeft, Bike, User, Phone, Mail, CreditCard, ShirtIcon, CheckCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const PREVENTA_LIMIT = 30;

export default function InscripcionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    fechaNacimiento: undefined as Date | undefined,
    sexo: "",
    categoria: "",
    modalidad: "",
    franela: "",
    telefono: "",
    email: "",
    pagoReferencia: "",
    pagoBanco: "",
    pagoFecha: "",
    pagoMonto: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellido || !formData.cedula || !formData.fechaNacimiento || !formData.sexo || !formData.categoria || !formData.modalidad || !formData.telefono || !formData.email) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    if (formData.modalidad !== "sola" && !formData.franela) {
      toast.error("Por favor selecciona el tipo de franela.");
      return;
    }

    setSubmitted(true);
    toast.success("¡Inscripción enviada exitosamente!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center border bg-card p-10">
          <CheckCircle className="mx-auto h-16 w-16 text-primary mb-6" />
          <h2 className="font-satoshi text-3xl font-black text-foreground mb-4">
            ¡INSCRIPCIÓN <span className="text-primary">RECIBIDA!</span>
          </h2>
          <p className="text-muted-foreground mb-2">
            Hemos recibido tu inscripción. Te contactaremos para confirmar tu participación.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Revisa tu correo <span className="font-mono text-foreground">{formData.email}</span> para más detalles.
          </p>
          <Link href="/" className="btn-mechanical bg-primary text-primary-foreground inline-flex">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Timer className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <span className="font-satoshi text-lg font-black uppercase tracking-tight text-foreground">
              Apex<span className="text-primary">Live</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
        {/* Title */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/30 px-4 py-1.5">
            <Bike className="h-4 w-4 text-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              Inscripciones Abiertas
            </span>
          </div>
          <h1 className="font-satoshi text-4xl font-black leading-tight text-foreground md:text-5xl italic">
            CARRERA DE <span className="text-primary">CICLISMO</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground font-medium">
            Completa el formulario para inscribirte. Los primeros {PREVENTA_LIMIT} cupos tienen precio de pre-venta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos Básicos */}
          <div className="border bg-card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground">
                Datos Básicos
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nombre" className="font-mono text-xs uppercase tracking-widest">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Tu nombre"
                  className="rounded-none border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido" className="font-mono text-xs uppercase tracking-widest">
                  Apellido *
                </Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                  placeholder="Tu apellido"
                  className="rounded-none border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cedula" className="font-mono text-xs uppercase tracking-widest">
                  Cédula de Identidad *
                </Label>
                <Input
                  id="cedula"
                  value={formData.cedula}
                  onChange={(e) => handleChange("cedula", e.target.value)}
                  placeholder="V-00000000"
                  className="rounded-none border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-mono text-xs uppercase tracking-widest">
                  Fecha de Nacimiento *
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-none border-border",
                        !formData.fechaNacimiento && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fechaNacimiento
                        ? format(formData.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                        : "Selecciona tu fecha de nacimiento"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fechaNacimiento}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, fechaNacimiento: date }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1920-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      fromYear={1920}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Sexo */}
            <div className="mt-6 space-y-3">
              <Label className="font-mono text-xs uppercase tracking-widest">Sexo *</Label>
              <RadioGroup
                value={formData.sexo}
                onValueChange={(v) => handleChange("sexo", v)}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="M" id="sexo-m" />
                  <Label htmlFor="sexo-m" className="text-sm cursor-pointer">Masculino</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="F" id="sexo-f" />
                  <Label htmlFor="sexo-f" className="text-sm cursor-pointer">Femenino</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Categoría */}
          <div className="border bg-card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Bike className="h-5 w-5 text-primary" />
              <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground">
                Categoría
              </h3>
            </div>

            <RadioGroup
              value={formData.categoria}
              onValueChange={(v) => handleChange("categoria", v)}
              className="grid gap-3 sm:grid-cols-2"
            >
              <label
                htmlFor="cat-elite"
                className={`flex cursor-pointer items-start gap-4 border-l-4 p-4 transition-colors ${
                  formData.categoria === "elite"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="elite" id="cat-elite" className="mt-1" />
                <div>
                  <span className="font-satoshi text-sm font-bold text-foreground">A) Élite</span>
                  <p className="mt-1 text-xs text-muted-foreground">Hasta 39 años</p>
                </div>
              </label>
              <label
                htmlFor="cat-master"
                className={`flex cursor-pointer items-start gap-4 border-l-4 p-4 transition-colors ${
                  formData.categoria === "master"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="master" id="cat-master" className="mt-1" />
                <div>
                  <span className="font-satoshi text-sm font-bold text-foreground">B) Master</span>
                  <p className="mt-1 text-xs text-muted-foreground">+40 años</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Modalidad de Inscripción */}
          <div className="border bg-card p-6 md:p-8">
            <div className="mb-2 flex items-center gap-3">
              <ShirtIcon className="h-5 w-5 text-primary" />
              <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground">
                Modalidad de Inscripción
              </h3>
            </div>
            <p className="mb-6 text-xs text-muted-foreground font-mono">
              <span className="text-primary font-bold">Pre-Venta:</span> Precio especial para los primeros {PREVENTA_LIMIT} cupos.
            </p>

            <RadioGroup
              value={formData.modalidad}
              onValueChange={(v) => {
                handleChange("modalidad", v);
                if (v === "sola") handleChange("franela", "");
              }}
              className="grid gap-3"
            >
              <label
                htmlFor="mod-sola"
                className={`flex cursor-pointer items-start gap-4 border-l-4 p-4 transition-colors ${
                  formData.modalidad === "sola"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="sola" id="mod-sola" className="mt-1" />
                <div>
                  <span className="font-satoshi text-sm font-bold text-foreground">Inscripción Sola</span>
                  <p className="mt-1 text-xs text-muted-foreground">Solo participación, sin franela</p>
                </div>
              </label>
              <label
                htmlFor="mod-franela"
                className={`flex cursor-pointer items-start gap-4 border-l-4 p-4 transition-colors ${
                  formData.modalidad === "con-franela"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="con-franela" id="mod-franela" className="mt-1" />
                <div>
                  <span className="font-satoshi text-sm font-bold text-foreground">Inscripción con Franela</span>
                  <p className="mt-1 text-xs text-muted-foreground">Participación + franela del evento</p>
                </div>
              </label>
            </RadioGroup>

            {/* Tipo de franela */}
            {formData.modalidad === "con-franela" && (
              <div className="mt-4 ml-8 border-l-2 border-primary/20 pl-6 animate-fade-in">
                <Label className="font-mono text-xs uppercase tracking-widest mb-3 block">
                  Tipo de Franela *
                </Label>
                <RadioGroup
                  value={formData.franela}
                  onValueChange={(v) => handleChange("franela", v)}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <label
                    htmlFor="fr-yersi"
                    className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                      formData.franela === "yersi-manga-larga"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="yersi-manga-larga" id="fr-yersi" />
                    <span className="text-sm text-foreground">A) Yersi manga larga</span>
                  </label>
                  <label
                    htmlFor="fr-corta"
                    className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                      formData.franela === "franela-manga-corta"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="franela-manga-corta" id="fr-corta" />
                    <span className="text-sm text-foreground">B) Franela manga corta</span>
                  </label>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Contacto */}
          <div className="border bg-card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground">
                Contacto
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefono" className="font-mono text-xs uppercase tracking-widest">
                  Número de Contacto *
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                  placeholder="+58 0412 000 0000"
                  className="rounded-none border-border font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-xs uppercase tracking-widest">
                  Correo Electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="tu@correo.com"
                  className="rounded-none border-border"
                />
              </div>
            </div>
          </div>

          {/* Datos de Pago Móvil */}
          <div className="border bg-card p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="font-satoshi text-lg font-black uppercase tracking-wide text-foreground">
                Datos de Pago Móvil
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pagoReferencia" className="font-mono text-xs uppercase tracking-widest">
                  Número de Referencia
                </Label>
                <Input
                  id="pagoReferencia"
                  value={formData.pagoReferencia}
                  onChange={(e) => handleChange("pagoReferencia", e.target.value)}
                  placeholder="Ej: 00000000"
                  className="rounded-none border-border font-mono tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagoBanco" className="font-mono text-xs uppercase tracking-widest">
                  Banco
                </Label>
                <Input
                  id="pagoBanco"
                  value={formData.pagoBanco}
                  onChange={(e) => handleChange("pagoBanco", e.target.value)}
                  placeholder="Nombre del banco"
                  className="rounded-none border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagoFecha" className="font-mono text-xs uppercase tracking-widest">
                  Fecha de Pago
                </Label>
                <Input
                  id="pagoFecha"
                  type="date"
                  value={formData.pagoFecha}
                  onChange={(e) => handleChange("pagoFecha", e.target.value)}
                  className="rounded-none border-border font-mono font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pagoMonto" className="font-mono text-xs uppercase tracking-widest">
                  Monto (Bs)
                </Label>
                <Input
                  id="pagoMonto"
                  type="number"
                  value={formData.pagoMonto}
                  onChange={(e) => handleChange("pagoMonto", e.target.value)}
                  placeholder="0.00"
                  className="rounded-none border-border font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="btn-mechanical bg-primary text-primary-foreground text-base px-10 py-3"
            >
              <Bike className="mr-2 h-5 w-5" />
              Enviar Inscripción
            </button>
            <p className="mt-4 text-xs text-muted-foreground font-mono">
              Los campos marcados con * son obligatorios
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

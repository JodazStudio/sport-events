"use client";

import React, { useEffect, useRef } from "react";
import { 
  HelpCircle, 
  BookOpen, 
  CreditCard, 
  Settings2, 
  Users, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  MessageSquare,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { gsap } from "gsap";

export function HelpView() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.from(".help-header", {
        y: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });

      // Cards animation
      gsap.from(".help-card", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      });

      // Info sections animation
      gsap.from(".help-info", {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.5
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const quickGuides = [
    {
      title: "Gestión de Eventos",
      description: "Aprende a crear y configurar eventos deportivos de alta precisión.",
      icon: Globe,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      steps: [
        "Crea un nuevo evento desde la pestaña 'Eventos'.",
        "Configura las categorías y etapas.",
        "Define los métodos de pago aceptados.",
        "Publica el evento para recibir inscripciones."
      ]
    },
    {
      title: "Verificación de Pagos",
      description: "Sistema eficiente para validar reportes de pago de atletas.",
      icon: CreditCard,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      steps: [
        "Revisa los pagos pendientes en 'Aprobaciones'.",
        "Compara el comprobante con el reporte.",
        "Aprueba o rechaza con un solo clic.",
        "El atleta recibirá un correo automático."
      ]
    },
    {
      title: "Control de Gestores",
      description: "Administra quién tiene acceso al sistema (Solo Superadmins).",
      icon: Users,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      steps: [
        "Invita a nuevos gestores por correo.",
        "Asigna roles y permisos específicos.",
        "Monitorea la actividad del sistema.",
        "Revoca accesos cuando sea necesario."
      ]
    }
  ];

  return (
    <div ref={containerRef} className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="help-header flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-black dark:border-white pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <HelpCircle className="size-8" />
            </div>
            <h1 className="text-4xl md:text-6xl tracking-tighter">Centro de Ayuda</h1>
          </div>
          <p className="text-muted-foreground font-medium max-w-2xl text-lg">
            Todo lo que necesitas para dominar el ecosistema de Zonacrono. Desde la creación de eventos hasta la gestión técnica de resultados.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Button className="btn-mechanical h-14 px-8 text-base">
            <MessageSquare className="mr-2 size-5" />
            Soporte Directo
          </Button>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickGuides.map((guide, idx) => (
          <Card key={idx} className="help-card rounded-none border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200 overflow-hidden group">
            <CardHeader className="space-y-4 border-b-2 border-black dark:border-white bg-muted/30">
              <div className={`p-3 w-fit ${guide.bg} border-2 border-black dark:border-white`}>
                <guide.icon className={`size-6 ${guide.color}`} />
              </div>
              <div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{guide.title}</CardTitle>
                <CardDescription className="text-sm font-medium mt-1 leading-relaxed">
                  {guide.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {guide.steps.map((step, sIdx) => (
                  <li key={sIdx} className="flex gap-3 text-sm font-medium group/item">
                    <div className="size-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 border border-primary/20">
                      <span className="text-[10px] font-black">{sIdx + 1}</span>
                    </div>
                    <span className="group-hover/item:text-foreground transition-colors">{step}</span>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="mt-6 p-0 h-auto font-black italic uppercase text-xs group-hover:gap-2 transition-all">
                Ver guía completa <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Featured Section: Technical Docs */}
      <div className="help-info grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-black text-white p-8 md:p-12 shadow-[12px_12px_0px_0px_var(--color-primary)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck className="size-64 -mr-20 -mt-20" />
          </div>
          
          <div className="relative z-10 space-y-6">
            <Badge className="bg-primary hover:bg-primary text-white rounded-none font-mono uppercase tracking-widest px-3 py-1">
              Documentación Técnica
            </Badge>
            <h2 className="text-3xl md:text-5xl text-white normal-case">Integración de Cronometraje</h2>
            <p className="text-white/70 font-medium text-lg leading-relaxed">
              ¿Eres un operador técnico? Nuestra API permite la sincronización en tiempo real de chips y sensores.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-white text-black hover:bg-white/90 rounded-none font-black italic uppercase px-8 h-12 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                Explorar API
                <ExternalLink className="ml-2 size-4" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-none font-black italic uppercase px-8 h-12">
                Protocolos SDK
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-2xl border-l-4 border-primary pl-4">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            {[
              { q: "¿Cómo cambio la tasa del dólar?", a: "Se sincroniza automáticamente con el BCV cada hora, pero puedes forzar la actualización desde el botón circular en el encabezado." },
              { q: "¿Puedo exportar los datos de atletas?", a: "Sí, dentro de cada evento en la pestaña de 'Configuración' encontrarás la opción de exportar a CSV/Excel." },
              { q: "¿Qué pasa si rechazo un pago?", a: "El sistema enviará automáticamente un correo al atleta informándole el motivo y permitiéndole reportar un nuevo pago." },
              { q: "¿Cómo funcionan las categorías?", a: "Puedes crearlas manualmente o usar el generador automático basado en edad y género." }
            ].map((faq, i) => (
              <div key={i} className="help-info p-5 border-2 border-black dark:border-white bg-card hover:bg-muted/50 transition-colors cursor-help">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold italic text-base mb-2">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground font-medium leading-relaxed">{faq.a}</p>
                  </div>
                  <ChevronRight className="size-5 text-primary shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status / Meta info */}
      <div className="help-info flex flex-col md:flex-row items-center justify-between p-6 bg-muted border-2 border-black dark:border-white">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="size-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <span className="font-mono text-xs uppercase tracking-widest font-black italic">
            Estatus del Sistema: Operacional
          </span>
        </div>
        
        <div className="flex items-center gap-8 font-mono text-[10px] uppercase tracking-tighter text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3" />
            V 2.4.0-PRO
          </div>
          <div className="flex items-center gap-2">
            <Zap className="size-3" />
            LATENCY: 42MS
          </div>
          <div className="hidden sm:block">
            © 2026 ZONACRONO TECNOLOGÍA
          </div>
        </div>
      </div>
    </div>
  );
}

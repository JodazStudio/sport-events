"use client";

import { MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button, Logo } from "@/components/ui";

export default function ForgotPasswordPage() {
  const whatsappNumber = "584121315110"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola,%20necesito%20ayuda%20para%20restablecer%20mi%20contraseña%20en%20Zonacrono.`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 lg:p-8 blueprint-grid">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link href="/" className="mb-4 group">
            <Logo 
              width={240} 
              height={55} 
              className="h-[50px] w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <h1 className="font-satoshi text-2xl font-black uppercase tracking-tight text-foreground italic">
            Recuperar <span className="text-primary">Contraseña</span>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Por motivos de seguridad, los restablecimientos de contraseña se gestionan de forma personalizada.
          </p>
        </div>

        {/* Content Card */}
        <div className="relative group">
          {/* Decorative Borders */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-card border-2 border-border p-8 shadow-2xl space-y-6 text-center">
            <div className="space-y-4">
              <p className="text-sm text-foreground/80 leading-relaxed">
                Para recuperar el acceso a tu cuenta, por favor contacta al administrador del sistema directamente a través de WhatsApp.
              </p>
              
              <Button 
                asChild
                className="w-full h-12 bg-green-600 text-white font-satoshi font-bold uppercase tracking-widest hover:bg-green-700 transition-all rounded-none gap-2 text-sm italic"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>

            <div className="pt-2">
              <Link 
                href="/login" 
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Seguridad de Cuenta • Zonacrono v1.0 • 2026
        </p>
      </div>
    </div>
  );
}

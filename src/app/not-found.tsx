"use client"
import Link from "next/link";
import Navbar from "@/components/zonacrono/Navbar";
import Footer from "@/components/zonacrono/Footer";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary selection:text-primary-foreground overflow-hidden">
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative px-4 py-12">
        {/* Background Effects */}
        <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Scanlines Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
            backgroundSize: "100% 2px, 3px 100%"
          }}
        />

        <div className="relative z-10 text-center max-w-4xl">
          {/* Main 404 Title Area */}
          <div className="relative inline-block mb-4 md:mb-8">
            {/* The Big Shadow 404 */}
            <h1 className="font-satoshi text-[14rem] md:text-[22rem] font-black leading-none italic tracking-tighter text-foreground/[0.03] select-none animate-pulse">
              404
            </h1>
            
            {/* The Foreground Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative">
                 <AlertTriangle className="absolute -top-12 left-1/2 -translate-x-1/2 h-8 w-8 text-primary animate-bounce md:-top-16 md:h-12 md:w-12" />
                 <h2 className="font-satoshi text-7xl md:text-9xl font-black italic tracking-tighter text-foreground mix-blend-difference drop-shadow-[0_0_20px_rgba(213,15,23,0.4)]">
                  LOST <span className="text-primary italic">PACE</span>
                </h2>
              </div>
            </div>
            
            {/* Industrial Brackets */}
            <div className="absolute -top-4 -left-4 w-16 h-16 border-t-4 border-l-4 border-primary/40 hidden md:block" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-4 border-r-4 border-primary/40 hidden md:block" />
          </div>

          {/* Bilingual Content Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4 text-left border-t border-border/50 pt-8 relative">
            {/* Divider for Desktop */}
            <div className="hidden md:block absolute top-8 bottom-0 left-1/2 w-px bg-border/50" />

            {/* Spanish Version */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 border border-primary/30 px-3 py-1 bg-primary/5">
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">ES_META_DATA</span>
              </div>
              <h3 className="font-satoshi text-2xl font-black italic uppercase text-foreground">
                Fuera de Ruta
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                El cronómetro se ha detenido. El punto de control que buscas no está en nuestro mapa o ha sido reubicado.
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/" 
              className="btn-mechanical bg-primary text-primary-foreground group w-full md:w-auto"
            >
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              <span>Volver al Inicio</span>
            </Link>
          </div>
        </div>

        {/* Decorative Industrial Elements */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Technical HUD elements */}
        <div className="absolute top-24 right-8 font-mono text-[10px] text-muted-foreground/40 hidden lg:block select-none space-y-1">
          <div>// ERROR: 404_NOT_FOUND</div>
          <div>// SESSION: REVOKED</div>
          <div>// LOC: NULL_PTR</div>
        </div>

        <div className="absolute bottom-24 left-8 font-mono text-[10px] text-muted-foreground/40 hidden lg:block select-none space-y-1">
          <div>GPS_LOCK: LOST</div>
          <div>PACER: DISCONNECTED</div>
          <div>CHRONO: 00:00:00:00</div>
        </div>

        {/* Bottom Bar Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20 overflow-hidden">
          <div className="h-full bg-primary/30 w-1/3 animate-[slide_3s_linear_infinite]" />
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

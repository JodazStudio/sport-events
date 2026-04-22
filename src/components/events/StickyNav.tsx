"use client";
import { Button, AnimatedContent } from "@/components/ui";


import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Detalles", href: "#detalles" },
  { label: "Ruta", href: "#ruta" },
  { label: "Precios", href: "#precios" },
  { label: "Reglamento", href: "#reglamento" },
  { label: "Galería", href: "#galeria" },
  { label: "Resultados", href: "#resultados" },
];

interface StickyNavProps {
  eventSlug?: string;
  eventName?: string;
}

export const StickyNav = ({ eventSlug, eventName }: StickyNavProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      const navHeight = 64; // Approximated sticky nav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b-2 ${
        scrolled 
          ? "bg-charcoal/95 backdrop-blur-md shadow-lg border-ember/50 py-2" 
          : "bg-charcoal border-transparent py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-4">
          {/* Hamburger - Mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-white hover:text-ember transition-colors p-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Event Name - Desktop Only */}
          <Link href="/" className="hidden lg:flex items-center gap-3 group">
            <div className="h-8 w-8 bg-black flex items-center justify-center font-black text-white italic shadow-[2px_2px_0px_0px_rgba(255,46,0,1)] group-hover:shadow-none transition-all text-sm">
              ZC
            </div>
            {eventName && (
              <AnimatedContent distance={10} direction="horizontal" delay={0.1} duration={0.6}>
                <span className="font-satoshi font-black uppercase tracking-tight text-sm italic text-white group-hover:text-ember transition-colors">
                  {eventName}
                </span>
              </AnimatedContent>
            )}
          </Link>
        </div>

        {/* Desktop Links - hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-1 cursor-pointer text-xs font-satoshi font-bold uppercase tracking-widest text-muted-foreground hover:text-ember transition-colors rounded-none"
            >
              {link.label}
            </button>
          ))}
        </div>

        {eventSlug && (
          <AnimatedContent distance={20} direction="horizontal" reverse delay={0.4}>
            <Link href={`/${eventSlug}/inscripciones`}>
              <Button
                variant="mechanical"
                className="bg-ember text-white hover:bg-ember/90 font-satoshi font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-none transition-all px-3 sm:px-4 border-0"
                style={{ boxShadow: '2px 2px 0px 0px rgba(255,255,255,0.3)' }}
              >
                Inscribirse
              </Button>
            </Link>
          </AnimatedContent>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-charcoal border-b-2 border-ember animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-4 bg-charcoal/40 backdrop-blur-xl">
            {eventName && (
              <div className="px-4 py-3 mb-2 border-b border-white/10 flex items-center gap-3">
                <div className="h-6 w-6 bg-black flex items-center justify-center font-black text-white italic shadow-[2px_2px_0px_0px_rgba(255,46,0,1)] text-[10px]">
                  ZC
                </div>
                <span className="font-satoshi font-black uppercase tracking-tight text-xs italic text-white">
                  {eventName}
                </span>
              </div>
            )}
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="w-full text-left px-4 py-4 cursor-pointer text-sm font-satoshi font-bold uppercase tracking-widest text-muted-foreground hover:text-ember hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};


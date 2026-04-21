"use client";
import { Button, AnimatedContent } from "@/components/ui";


import { CalendarDays, MapPin, Clock, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { EventData } from "./types";

interface HeroSectionProps {
  event?: EventData;
  countdownTarget?: Date;
}

export const EventHero = ({ event, countdownTarget }: HeroSectionProps) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-charcoal">
        {event?.bannerUrl && (
          <img
            src={event.bannerUrl}
            alt={event?.name || "Evento"}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <AnimatedContent>
          <h1 className="font-satoshi font-black text-4xl sm:text-6xl md:text-8xl lg:text-9xl text-white leading-none mb-6 tracking-tight italic uppercase">
            {event?.name || "Nombre del Evento"}
          </h1>
        </AnimatedContent>

        <AnimatedContent delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/70 font-satoshi text-base sm:text-lg mb-10">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-ember" />
              {event?.date || "Fecha por confirmar"}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-ember" />
              {event?.time || "Hora por confirmar"}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-ember" />
              {event?.location || "Ubicación por confirmar"}
            </span>
          </div>
        </AnimatedContent>

        {/* Countdown placeholder */}
        {countdownTarget && (
          <div className="flex justify-center flex-wrap gap-4 mb-10">
            {["Días", "Horas", "Min", "Seg"].map((label, idx) => (
              <AnimatedContent key={label} delay={0.4 + idx * 0.1} distance={50}>
                <div className="flex flex-col items-center min-w-[70px]">
                  <span className="font-satoshi font-black text-3xl sm:text-4xl md:text-5xl text-ember italic">--</span>
                  <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider font-satoshi">
                    {label}
                  </span>
                </div>
              </AnimatedContent>
            ))}
          </div>
        )}

        <AnimatedContent delay={0.8}>
          {event?.slug ? (
            <Link href={`/${event.slug}/inscripciones`}>
              <Button
                size="lg"
                className="bg-ember text-ember-foreground hover:bg-ember/90 font-satoshi font-bold text-lg px-10 py-6 rounded-none transition-all transform hover:scale-105 active:scale-95"
              >
                Inscríbete Ahora
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              className="bg-ember text-ember-foreground hover:bg-ember/90 font-satoshi font-bold text-lg px-10 py-6 rounded-none"
            >
              Inscríbete Ahora
            </Button>
          )}
        </AnimatedContent>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/50" />
      </div>
    </section>
  );
};


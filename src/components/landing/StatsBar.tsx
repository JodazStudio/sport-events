"use client";

import { Signal, Laptop, Radio, HeadphonesIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: Signal, value: "100%", label: "Cobertura", suffix: "" },
  { icon: Laptop, value: "WEB", label: "Plataforma", suffix: "" },
  { icon: Radio, value: "LIVE", label: "Resultados", suffix: "" },
  { icon: HeadphonesIcon, value: "24/7", label: "Soporte", suffix: "" },
];

export const StatsBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex flex-col items-center gap-2 border-border px-6 py-8 ${
              i < stats.length - 1 ? "lg:border-r" : ""
            } ${i % 2 === 0 ? "border-r lg:border-r" : ""} ${
              i < 2 ? "border-b lg:border-b-0" : ""
            } ${visible ? "animate-count-up" : "opacity-0"}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <stat.icon className="h-5 w-5 text-primary" strokeWidth={2} />
            <span className="font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {stat.value}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};


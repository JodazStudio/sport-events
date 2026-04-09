"use client";

import { useState } from "react";
import { Menu, X, Timer, Activity } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Eventos", href: "/#eventos" },
  { label: "Soluciones", href: "/#servicios" },
  { label: "Live Dashboard", href: "/dashboard", isLive: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-card/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Timer className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <span className="font-satoshi text-lg font-black uppercase tracking-tight text-foreground">
            Zona<span className="text-primary">crono</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:text-primary flex items-center gap-1.5 ${
                link.isLive ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              {link.isLive && <Activity className="h-3 w-3 animate-pulse" />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            Login
          </Link>
          <Link
            href="/#contacto"
            className="btn-mechanical bg-primary text-primary-foreground"
          >
            Cotiza Aquí
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-card md:hidden">
          <div className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`px-3 py-3 font-mono text-xs uppercase tracking-widest transition-colors hover:text-primary flex items-center gap-2 ${
                    link.isLive ? "text-primary font-bold" : "text-muted-foreground"
                }`}
              >
                {link.isLive && <Activity className="h-3 w-3 animate-pulse" />}
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-3 py-3 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
            >
              Login
            </Link>
            <Link
              href="/#contacto"
              onClick={() => setOpen(false)}
              className="btn-mechanical mt-2 bg-primary text-center text-primary-foreground"
            >
              Cotiza Aquí
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

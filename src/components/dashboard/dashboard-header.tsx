"use client";

import React, { useEffect, useState } from "react";
import { 
  RefreshCw, 
  User, 
  Menu, 
  X,
  LayoutDashboard, 
  Settings2, 
  CreditCard, 
  Activity,
  Users,
  Globe
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAuthStore } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useExchangeRates } from "@/hooks/queries/useAkomo";

interface ExchangeRate {
  id: string;
  label: string;
  value: string;
  currency: string;
}

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { role, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // React Query for exchange rates
  const { data: rateData, isFetching: isSyncing, refetch } = useExchangeRates();

  // Calculate formatted rate
  const bcvRate = React.useMemo(() => {
    if (!rateData?.rates) return "36.54";
    const bcv = rateData.rates.find((r: any) => r.label === "USD" || r.label === "Dólar BCV");
    if (!bcv) return "36.54";
    const formattedValue = bcv.value.replace(",", ".");
    return parseFloat(formattedValue).toFixed(2);
  }, [rateData]);

  const adminNavItems = [
    { title: "Resumen", url: "/dashboard/overview", icon: LayoutDashboard },
    { title: "Eventos", url: "/dashboard/events", icon: Globe },
    { title: "Gestores", url: "/dashboard/managers", icon: Users, superadminOnly: true },
    { title: "Aprobaciones", url: "/dashboard/payments", icon: CreditCard },
  ];

  const currentNavItems = adminNavItems.filter(item => 
    !item.superadminOnly || role === 'superadmin'
  );

  const handleRefreshRates = () => {
    refetch();
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background/95 backdrop-blur px-4 md:px-8">
        {/* Logo Section */}
        <Link href="/dashboard" className="flex items-center gap-3 mr-8 shrink-0">
          <div className="h-9 w-9 bg-black flex items-center justify-center font-black text-white italic shadow-[3px_3px_0px_0px_hsl(var(--primary))]">
            ZC
          </div>
          <div className="flex flex-col">
            <span className="font-satoshi font-black uppercase tracking-tight text-xl italic leading-none">
              Zona<span className="text-primary">crono</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {currentNavItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Link 
                key={item.url} 
                href={item.url}
                className={`
                  flex items-center gap-2 px-4 py-2 transition-all duration-200 group relative
                  ${isActive 
                    ? "text-primary font-black italic" 
                    : "text-muted-foreground hover:text-foreground font-medium"}
                `}
              >
                <item.icon className={`size-4 transition-transform group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
                <span className="font-satoshi uppercase tracking-tight text-xs">
                  {item.title}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1 duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Rates + Profile + Hamburger */}
        <div className="flex items-center gap-3 ml-auto">

          <Badge 
            variant="outline" 
            className="hidden sm:flex bg-muted/30 border-dashed py-1.5 px-3 items-center gap-2 group cursor-pointer hover:bg-muted"
            onClick={handleRefreshRates}
          >
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              BCV:
            </span>
            <span className="font-mono font-bold text-xs tabular-nums">
              {bcvRate}
            </span>
            <RefreshCw 
              className={`size-3 text-primary transition-all duration-500 ${isSyncing ? "animate-spin" : "group-hover:rotate-180"}`} 
            />
          </Badge>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-none border-2 border-black dark:border-white p-0 bg-muted hover:bg-muted/80 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <Avatar className="h-8 w-8 rounded-none">
                  <AvatarFallback className="rounded-none bg-primary text-primary-foreground font-black text-[10px] italic">
                    {role === 'superadmin' ? 'SA' : 'AD'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-none border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-0 overflow-hidden">
              <DropdownMenuLabel className="font-satoshi uppercase italic font-black bg-black dark:bg-white text-white dark:text-black p-3">Mi Cuenta</DropdownMenuLabel>
              <div className="p-1">
                <DropdownMenuItem className="cursor-pointer font-bold italic py-2">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil Personal</span>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-black/10" />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:text-destructive font-black italic py-2"
                  onClick={async () => {
                    await logout();
                    router.push("/login");
                  }}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>


          {/* Mobile Hamburger */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden animate-in slide-in-from-top duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <nav className="relative bg-background border-b shadow-xl p-4 flex flex-col gap-2">
            {currentNavItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <Link 
                  key={item.url} 
                  href={item.url}
                  className={`
                    flex items-center gap-4 p-4 transition-all
                    ${isActive 
                      ? "bg-primary/5 text-primary font-black italic border-l-4 border-primary" 
                      : "hover:bg-muted text-muted-foreground font-medium border-l-4 border-transparent"}
                  `}
                >
                  <item.icon className="size-5" />
                  <span className="font-satoshi uppercase tracking-tight text-sm">
                    {item.title}
                  </span>
                </Link>
              );
            })}
            
            {/* Mobile-only Rate Display */}
            <div className="mt-4 p-4 border-t sm:hidden">
              <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
                <span className="uppercase tracking-widest">Tasa BCV Hoy</span>
                <span className="font-bold text-foreground">{bcvRate} VES</span>
              </div>
            </div>
            
            <div className="p-4 border-t flex items-center gap-2 font-mono text-[9px] text-muted-foreground uppercase bg-muted/20">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Sistema Operacional
            </div>
          </nav>
        </div>
      )}
    </>
  );
}

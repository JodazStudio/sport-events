"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/ui";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no session, redirect to login
    if (!isLoading && !session) {
      router.push("/login");
    }
  }, [session, isLoading, router]);

  // Premium loading state
  if (isLoading || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background blueprint-grid">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-all duration-1000 animate-pulse" />
            <Logo 
              width={240} 
              height={55} 
              className="h-[50px] w-auto object-contain relative"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                Verificando Acceso
              </span>
            </div>
            <div className="h-[2px] w-24 bg-muted overflow-hidden relative">
              <div className="absolute inset-0 bg-primary animate-progress-line" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background blueprint-grid">
      <DashboardHeader />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-(--breakpoint-2xl)">
          <main className="p-6 md:p-12 animate-in fade-in duration-700">
            <div className="mx-auto max-w-7xl space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

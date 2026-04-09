"use client";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GodModeBanner } from "@/components/dashboard/god-mode-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background blueprint-grid">
      <DashboardHeader />
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-(--breakpoint-2xl)">
          <GodModeBanner />
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

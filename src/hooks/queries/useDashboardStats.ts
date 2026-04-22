"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

export const dashboardKeys = {
  stats: ["dashboard", "stats"] as const,
};

export function useDashboardStats() {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      const response = await fetch("/api/admin/dashboard/stats", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch dashboard stats");
      
      return response.json();
    },
    enabled: !!session?.access_token,
    refetchInterval: 60000, // Refetch every minute
  });
}

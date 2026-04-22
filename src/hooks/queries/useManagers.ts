"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

export const managerKeys = {
  all: ["managers"] as const,
};

export function useManagers() {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: managerKeys.all,
    queryFn: async () => {
      if (!session?.access_token) return [];
      const response = await fetch("/api/managers", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch managers");
      return response.json();
    },
    enabled: !!session?.access_token,
  });
}

export function useCreateManager() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  return useMutation({
    mutationFn: async (newManager: any) => {
      const response = await fetch("/api/managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(newManager),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create manager");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: managerKeys.all });
    },
  });
}

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

export const eventKeys = {
  all: ["events"] as const,
  admin: ["events", "admin"] as const,
  detail: (id: string) => ["events", id] as const,
};

export function useAdminEvents() {
  const { session } = useAuthStore();
  
  return useQuery({
    queryKey: eventKeys.admin,
    queryFn: async () => {
      if (!session?.access_token) return { events: [], managers: [] };
      const response = await fetch("/api/admin/events", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch admin events");
      return response.json();
    },
    enabled: !!session?.access_token,
  });
}

export function useProvisionEvent() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  return useMutation({
    mutationFn: async (newEvent: any) => {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(newEvent),
      });
      if (!response.ok) throw new Error("Failed to provision event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.admin });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  return useMutation({
    mutationFn: async (updates: any) => {
      const response = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update event");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.admin });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: eventKeys.detail(variables.id) });
      }
    },
  });
}

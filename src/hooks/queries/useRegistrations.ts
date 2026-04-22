"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

export const registrationKeys = {
  byEvent: (eventId: string) => ["registrations", eventId] as const,
};

export function useRegistrations(eventId: string) {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: registrationKeys.byEvent(eventId),
    queryFn: async () => {
      if (!session?.access_token || !eventId) return { registrations: [] };
      const response = await fetch(`/api/admin/registrations?eventId=${eventId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch registrations");
      return response.json();
    },
    enabled: !!session?.access_token && !!eventId,
  });
}

export function useUpdateRegistrationStatus() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  return useMutation({
    mutationFn: async ({ registrationId, status, eventId }: { registrationId: string, status: string, eventId: string }) => {
      const response = await fetch("/api/admin/registrations/status", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ registrationId, status }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update status");
      }
      return { response: await response.json(), eventId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: registrationKeys.byEvent(data.eventId) });
    },
  });
}

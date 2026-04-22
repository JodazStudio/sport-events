"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store";

export const stageKeys = {
  byEvent: (eventId: string) => ["stages", eventId] as const,
};

export function useStages(eventId: string) {
  const { session } = useAuthStore();

  return useQuery({
    queryKey: stageKeys.byEvent(eventId),
    queryFn: async () => {
      if (!session?.access_token || !eventId) return [];
      const response = await fetch(`/api/stages?event_id=${eventId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch stages");
      const result = await response.json();
      return result.data || [];
    },
    enabled: !!session?.access_token && !!eventId,
  });
}

export function useMutationStage() {
  const queryClient = useQueryClient();
  const { session } = useAuthStore();

  return useMutation({
    mutationFn: async ({ method, body }: { method: "POST" | "PUT" | "DELETE", body: any }) => {
      let url = "/api/stages";
      if (method === "DELETE") {
        url += `?id=${body.id}&event_id=${body.event_id}`;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: method !== "DELETE" ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process stage");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      const eventId = variables.body.event_id;
      if (eventId) {
        queryClient.invalidateQueries({ queryKey: stageKeys.byEvent(eventId) });
      }
    },
  });
}

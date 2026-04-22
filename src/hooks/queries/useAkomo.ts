"use client";

import { useQuery } from "@tanstack/react-query";

export const akomoKeys = {
  all: ["akomo"] as const,
  rates: ["akomo", "rates"] as const,
};

export function useExchangeRates() {
  return useQuery({
    queryKey: akomoKeys.rates,
    queryFn: async () => {
      const response = await fetch("/api/akomo");
      if (!response.ok) throw new Error("Failed to fetch exchange rates");
      return response.json();
    },
    // Refresh every 15 minutes in background
    staleTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
  });
}

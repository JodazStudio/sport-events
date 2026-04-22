"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

export const akomoKeys = {
  rates: (date: string) => ["akomo", "rates", date] as const,
};

export function useExchangeRates() {
  const today = format(new Date(), "yyyy-MM-dd");

  return useQuery({
    queryKey: akomoKeys.rates(today),
    queryFn: async () => {
      const response = await fetch("https://api.akomo.xyz/api/exchange-rates");
      if (!response.ok) throw new Error("Failed to fetch exchange rates");
      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
}

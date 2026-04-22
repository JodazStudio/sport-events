import { getBcvRate } from "@/lib";

/**
 * Service for interacting with Akomo API and related currency operations
 */
export const akomoService = {
  /**
   * Fetches all exchange rates from Akomo
   */
  async getRates() {
    try {
      const res = await fetch('https://api.akomo.xyz/api/exchange-rates', {
        next: { revalidate: 3600 },
      });
      if (!res.ok) {
        return { rates: [] };
      }
      return await res.json();
    } catch (error) {
      console.error('Error in akomoService.getRates:', error);
      return { rates: [] };
    }
  },

  /**
   * Fetches the latest exchange rate from BCV (USD)
   */
  async getExchangeRate(): Promise<number> {
    return await getBcvRate();
  }
};

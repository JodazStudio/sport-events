/**
 * Service for interacting with the AKomo API (api.akomo.xyz)
 */
export const akomoService = {
  /**
   * Fetches the latest exchange rates from AKomo
   * Prioritizes the USD/VES rate (BCV)
   */
  async getExchangeRate(): Promise<number> {
    const DEFAULT_RATE = 54.20;
    try {
      const response = await fetch("https://api.akomo.xyz/api/exchange-rates", {
        next: { revalidate: 3600 } // Cache for 1 hour
      });

      if (!response.ok) return DEFAULT_RATE;

      const data = await response.json();
      const rate = data.rates?.find((r: any) => r.label === "USD" || r.label === "Dólar BCV");
      
      if (!rate) return DEFAULT_RATE;

      // Parse "36,25" string format to 36.25 number
      return parseFloat(rate.value.replace(",", "."));
    } catch (error) {
      console.error("Error fetching exchange rate from AKomo:", error);
      return DEFAULT_RATE;
    }
  }
};

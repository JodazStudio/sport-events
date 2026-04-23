/**
 * Utility for currency and exchange rate operations.
 * Uses the Akomo API (api.akomo.xyz) to fetch the latest rates.
 */

export async function getBcvRate(): Promise<number> {
  try {
    const res = await fetch('https://api.akomo.xyz/api/exchange-rates', {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!res.ok) {
      console.warn('Failed to fetch rates from Akomo API, using fallback rate');
      return 0; // Or a sensible default/fallback
    }
    
    const data = await res.json();
    const bcvRateObj = data?.rates?.find((rate: any) => rate.label === 'USD');

    if (bcvRateObj && bcvRateObj.value) {
      // The API returns values like "36,25", so we need to convert comma to dot
      const parsedValue = parseFloat(bcvRateObj.value.replace(',', '.'));
      return isNaN(parsedValue) ? 0 : parsedValue;
    }
    
    return 0;
  } catch (error) {
    console.error('Error fetching BCV rate from Akomo:', error);
    return 0;
  }
}

import banksData from './data/banks.json';

export interface Bank {
  codigo: string;
  nombre: string;
}

export const VENEZUELA_BANKS: Bank[] = banksData.bancos_venezuela;

/**
 * Get the list of banks formatted for a select/combobox
 */
export const BANK_OPTIONS = VENEZUELA_BANKS.map(bank => ({
  value: bank.codigo,
  label: `${bank.codigo} - ${bank.nombre}`
}));

/**
 * Find a bank by its code
 */
export function getBankByCode(code: string | undefined | null): Bank | undefined {
  if (!code) return undefined;
  return VENEZUELA_BANKS.find(bank => bank.codigo === code);
}

/**
 * Get the bank name by code, fallback to a default or the code itself
 */
export function getBankName(code: string | undefined | null): string {
  const bank = getBankByCode(code);
  return bank ? bank.nombre : (code || '');
}

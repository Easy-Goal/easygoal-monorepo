// Dinheiro canônico do ecossistema (plano s361, decisão 1).
// Regra: todo valor monetário trafega como CENTAVOS INTEIROS (`*_cents`). A conversão de
// reais → centavos acontece uma única vez, no service da API. O front só formata.
// Nunca dividir por 100 em componente: usar `formatBRL(cents)`.

/** Centavos inteiros. Alias documental — o compilador aceita `number`. */
export type Cents = number;

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Garante centavos inteiros e finitos; qualquer outra coisa vira 0. */
export function toCents(value: number | null | undefined): Cents {
  if (value == null || !Number.isFinite(value)) return 0;
  return Math.round(value);
}

/** Reais (ex.: 197.9 ou "197,90") → centavos. Usar só na fronteira com dados em reais. */
export function reaisToCents(reais: number | string | null | undefined): Cents {
  if (reais == null || reais === '') return 0;
  const n = typeof reais === 'number' ? reais : Number(String(reais).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Centavos → reais (número), para APIs externas que exigem reais. */
export function centsToReais(cents: Cents | null | undefined): number {
  return toCents(cents) / 100;
}

/**
 * Centavos → "R$ 1.234,56". O espaço entre "R$" e o número é inquebrável,
 * então o valor nunca quebra linha no meio.
 */
export function formatBRL(cents: Cents | null | undefined): string {
  return BRL.format(toCents(cents) / 100);
}

/** Centavos → "R$ 1,2 mil" / "R$ 3,4 mi" para cards estreitos. */
export function formatBRLCompact(cents: Cents | null | undefined): string {
  return BRL_COMPACT.format(toCents(cents) / 100);
}

/** Máscara de input estilo caixa eletrônico: "4999" → "49,99". */
export function maskBRLInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  const cents = digits === '' ? 0 : parseInt(digits, 10);
  return (cents / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Texto mascarado ("49,99") → centavos (4999). */
export function brlInputToCents(display: string): Cents {
  const digits = display.replace(/\D/g, '');
  return digits === '' ? 0 : parseInt(digits, 10);
}

/** Valor de um período convertido para o mês (MRR). */
export function monthlyCents(cents: Cents | null | undefined, frequency: string | null | undefined): Cents {
  const c = toCents(cents);
  switch (frequency) {
    case 'yearly':
    case 'annual':
      return Math.round(c / 12);
    case 'semiannual':
      return Math.round(c / 6);
    case 'quarterly':
      return Math.round(c / 3);
    default:
      return c;
  }
}

import { z } from 'zod';

// Atribuição comum a todo SaaS do ecossistema (plano s360, frente S).
// Cada SaaS captura a origem no próprio domínio e envia ao SSO no parâmetro `att`
// do link de login. O SSO só repassa: grava primeiro e último toque por usuário.
// Funções puras, sem DOM nem Node, para rodar no navegador, no Edge e no servidor.

/** Nome do parâmetro de query que leva a atribuição ao SSO. */
export const ATTRIBUTION_PARAM = 'att';

/** Tamanho máximo aceito do `att` serializado. O resto é descartado. */
export const ATTRIBUTION_MAX_LENGTH = 2048;

export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
export const CLICK_ID_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid'] as const;

const shortText = z.string().trim().min(1).max(200);
const longText = z.string().trim().min(1).max(500);

/** Um toque de atribuição: de onde a pessoa veio e quando. */
export const AttributionTouchSchema = z
  .object({
    utm_source: shortText.optional(),
    utm_medium: shortText.optional(),
    utm_campaign: shortText.optional(),
    utm_content: shortText.optional(),
    utm_term: shortText.optional(),
    gclid: shortText.optional(),
    gbraid: shortText.optional(),
    wbraid: shortText.optional(),
    fbclid: shortText.optional(),
    ttclid: shortText.optional(),
    msclkid: shortText.optional(),
    referrer: longText.optional(),
    landing: longText.optional(),
    at: z.string().datetime(),
  })
  .strip();
export type AttributionTouch = z.infer<typeof AttributionTouchSchema>;

/** Tem UTM ou click ID? Toque só com referrer não sobrescreve o último toque de campanha. */
export function isCampaignTouch(touch: AttributionTouch): boolean {
  return [...UTM_KEYS, ...CLICK_ID_KEYS].some((key) => Boolean(touch[key]));
}

/**
 * Lê a atribuição de uma URL de entrada (a página que a pessoa abriu).
 * Devolve `null` se não houver UTM nem click ID, para não gravar visita direta como campanha.
 */
export function readAttributionFromUrl(
  pageUrl: string,
  options: { referrer?: string; now?: Date } = {},
): AttributionTouch | null {
  let url: URL;
  try {
    url = new URL(pageUrl);
  } catch {
    return null;
  }

  const raw: Record<string, string> = {};
  for (const key of [...UTM_KEYS, ...CLICK_ID_KEYS]) {
    const value = url.searchParams.get(key);
    if (value) raw[key] = value;
  }
  if (Object.keys(raw).length === 0) return null;

  // A página de entrada sem query: os parâmetros já estão nos campos próprios.
  raw.landing = `${url.origin}${url.pathname}`;
  if (options.referrer) raw.referrer = options.referrer;
  raw.at = (options.now ?? new Date()).toISOString();

  const parsed = AttributionTouchSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/** Serializa para o parâmetro `att`. URLSearchParams cuida da codificação. */
export function encodeAttribution(touch: AttributionTouch): string {
  const value = JSON.stringify(touch);
  return value.length <= ATTRIBUTION_MAX_LENGTH ? value : '';
}

/** Lê o `att` recebido. Valor inválido, grande demais ou sem campanha vira `null`, sem erro. */
export function decodeAttribution(value: string | null | undefined): AttributionTouch | null {
  if (!value || value.length > ATTRIBUTION_MAX_LENGTH) return null;
  try {
    const parsed = AttributionTouchSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

/** Acrescenta `att` ao link de login do SSO, preservando os demais parâmetros. */
export function withAttribution(loginUrl: string, touch: AttributionTouch | null): string {
  if (!touch) return loginUrl;
  const encoded = encodeAttribution(touch);
  if (!encoded) return loginUrl;
  const url = new URL(loginUrl);
  url.searchParams.set(ATTRIBUTION_PARAM, encoded);
  return url.toString();
}

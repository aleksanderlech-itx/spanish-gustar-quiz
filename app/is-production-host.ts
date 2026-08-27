import { SITE_CONFIG } from "./site-config";

/** Staging (staging.spanish-quizz.es) and any other non-canonical host — Workers.dev
 * preview URLs, etc. — must never be indexed. Checked by exact hostname rather than
 * "contains staging" so an unrecognized host defaults to blocked, not allowed. */
export function isProductionHost(host: string): boolean {
  const bareHost = host.split(":")[0]?.toLowerCase() ?? "";
  const productionHost = new URL(SITE_CONFIG.url).hostname;
  return bareHost === productionHost || bareHost === `www.${productionHost}`;
}

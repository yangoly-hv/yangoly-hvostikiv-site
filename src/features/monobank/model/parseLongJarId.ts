/**
 * Validate a Monobank widget longJarId stored in Sanity.
 * Rejects URLs, whitespace-only values, and unsafe characters.
 */
export const parseLongJarId = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return null;
  if (trimmed.includes("/") || trimmed.includes("?") || trimmed.includes("#")) return null;
  // Widget longJarIds are opaque alphanumeric strings (often 20–40 chars).
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(trimmed)) return null;
  return trimmed;
};

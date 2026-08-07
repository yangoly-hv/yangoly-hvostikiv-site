/**
 * Extract Monobank jar sendId from a public jar URL.
 * Accepts:
 * - https://send.monobank.ua/jar/{sendId}
 * - https://send.monobank.ua/{sendId}
 * - send.monobank.ua/jar/{sendId} (no scheme)
 */
export const parseJarSendId = (rawUrl: string): string | null => {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(withScheme);
    const host = url.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "send.monobank.ua") return null;

    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length === 0) return null;

    if (segments[0]?.toLowerCase() === "jar") {
      const sendId = segments[1];
      return sendId && !segments[2] ? sendId : null;
    }

    if (segments.length === 1) {
      return segments[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
};

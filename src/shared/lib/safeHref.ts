const SAFE_ABSOLUTE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);
const CONTROL_CHARACTERS = /[\u0000-\u001F\u007F]/;
const URL_SCHEME = /^[a-zA-Z][a-zA-Z\d+.-]*:/;

export const getSafeHref = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;

  const href = value.trim();
  if (!href || CONTROL_CHARACTERS.test(href) || href.startsWith("//")) {
    return undefined;
  }

  if (href.startsWith("/") || href.startsWith("#") || href.startsWith("?")) {
    return href;
  }

  if (!URL_SCHEME.test(href)) {
    return href.includes("\\") ? undefined : href;
  }

  try {
    const url = new URL(href);
    return SAFE_ABSOLUTE_PROTOCOLS.has(url.protocol) ? href : undefined;
  } catch {
    return undefined;
  }
};

export const isExternalWebHref = (href: string) => {
  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

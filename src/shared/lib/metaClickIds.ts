export const META_FBP_PATTERN = /^fb\.1\.\d+\.\d+$/;
export const META_FBC_PATTERN = /^fb\.1\.\d+\.[A-Za-z0-9_-]+$/;
export const META_EXTERNAL_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

export const isValidMetaFbp = (value: string) => META_FBP_PATTERN.test(value);
export const isValidMetaFbc = (value: string) => META_FBC_PATTERN.test(value);
export const isValidMetaExternalId = (value: string) =>
  META_EXTERNAL_ID_PATTERN.test(value);

const cookieValue = (cookieHeader: string, name: string) => {
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;
    if (trimmed.slice(0, separator) !== name) continue;
    return trimmed.slice(separator + 1);
  }
  return undefined;
};

const fbclidFromHref = (href: string) => {
  try {
    return new URL(href).searchParams.get("fbclid")?.trim() || undefined;
  } catch {
    return undefined;
  }
};

export const getMetaClickIds = ({
  cookieHeader,
  href,
  now = Date.now(),
}: {
  cookieHeader: string;
  href: string;
  now?: number;
}): { fbp?: string; fbc?: string } => {
  const fbpCookie = cookieValue(cookieHeader, "_fbp");
  const fbcCookie = cookieValue(cookieHeader, "_fbc");
  const fbp = fbpCookie && isValidMetaFbp(fbpCookie) ? fbpCookie : undefined;
  if (fbcCookie && isValidMetaFbc(fbcCookie)) {
    return { fbp, fbc: fbcCookie };
  }

  const fbclid = fbclidFromHref(href);
  const built = fbclid ? `fb.1.${now}.${fbclid}` : undefined;
  return {
    fbp,
    fbc: built && isValidMetaFbc(built) ? built : undefined,
  };
};

export type WayforpayCheckoutValue = string | number | readonly (string | number)[];

export type WayforpayFormField = {
  name: string;
  value: string;
};

export type WayforpayCheckoutPayload = Record<string, WayforpayCheckoutValue>;

const requiredScalarFields = [
  "merchantAccount", "merchantDomainName", "merchantSignature", "orderReference", "orderDate", "amount", "currency", "returnUrl", "serviceUrl",
] as const;

export const isWayforpayCheckoutPayload = (value: unknown): value is WayforpayCheckoutPayload => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const payload = value as Record<string, unknown>;
  return requiredScalarFields.every((field) => typeof payload[field] === "string" || typeof payload[field] === "number")
    && ["productName", "productPrice", "productCount"].every((field) => Array.isArray(payload[field]) && payload[field].every((item) => typeof item === "string" || typeof item === "number"));
};

/**
 * WayForPay expects product arrays as repeated HTML fields named `field[]`.
 * Semicolons are used in the HMAC string, not in the browser form payload.
 */
export const getWayforpayFormFields = (
  checkout: WayforpayCheckoutPayload,
): WayforpayFormField[] =>
  Object.entries(checkout).flatMap(([name, value]) => {
    if (!Array.isArray(value)) return [{ name, value: String(value) }];

    return value.map((item) => ({ name: `${name}[]`, value: String(item) }));
  });

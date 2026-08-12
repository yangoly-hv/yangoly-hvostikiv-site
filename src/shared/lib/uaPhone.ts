/** Digits only. */
export const phoneDigits = (value: string) => value.replace(/\D/g, "");

/**
 * Normalize messy autofill/paste into UA national 10 digits (0XXXXXXXXX).
 * Handles +380…, 380…, 0…, and values already partially applied to +38 (…)-mask.
 */
export const toUaNationalPhoneDigits = (value: string): string => {
  let digits = phoneDigits(value);

  // Full international: 380 + 9 subscriber digits
  if (digits.startsWith("380") && digits.length >= 12) {
    return `0${digits.slice(3, 12)}`;
  }

  // Mask already includes leading 38, autofill then inserted 380… into slots:
  // e.g. 3838068074331 from +38 (380) 680-74-331 or similar
  if (digits.startsWith("38380") && digits.length >= 12) {
    return `0${digits.slice(5, 14)}`;
  }

  // Leading 38 with national already starting with 0: 38 + 0XXXXXXXXX
  if (digits.startsWith("38") && digits.length >= 12 && digits[2] === "0") {
    return digits.slice(2, 12);
  }

  // Leading 38 + 380… (mangled / truncated international into mask)
  if (digits.startsWith("38") && digits.slice(2, 5) === "380") {
    const afterCountry = digits.slice(5);
    if (afterCountry.length >= 9) {
      return `0${afterCountry.slice(0, 9)}`;
    }
    return `0${afterCountry}`.slice(0, 10);
  }

  if (digits.startsWith("38") && digits.length > 2) {
    digits = digits.slice(2);
  }

  if (digits.startsWith("380") && digits.length >= 4) {
    digits = digits.slice(3);
    if (!digits.startsWith("0")) {
      digits = `0${digits}`;
    }
  }

  if (digits.length === 9 && !digits.startsWith("0")) {
    digits = `0${digits}`;
  }

  return digits.slice(0, 10);
};

/** Format as +38 (0XX) XXX-XX-XX for the input mask (partial-safe). */
export const formatUaPhoneMaskValue = (value: string): string => {
  const digits = toUaNationalPhoneDigits(value);
  if (!digits) return "";

  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 8);
  const d = digits.slice(8, 10);

  let result = "+38";
  if (a.length > 0) result += ` (${a}`;
  if (a.length === 3) result += ")";
  if (b.length > 0) result += ` ${b}`;
  if (c.length > 0) result += `-${c}`;
  if (d.length > 0) result += `-${d}`;
  return result;
};

import type { MonobankJarStatus, MonobankPublicJar } from "./types";

export const minorToUah = (amountMinor: number): number => amountMinor / 100;

export const toJarStatusFromPublic = (jar: MonobankPublicJar): MonobankJarStatus | null => {
  const jarId = typeof jar.jarId === "string" ? jar.jarId.trim() : "";
  if (!jarId) return null;

  const title = typeof jar.title === "string" ? jar.title.trim() : "";
  if (!title) return null;

  if (typeof jar.amount !== "number" || !Number.isFinite(jar.amount)) return null;

  return {
    title,
    balanceUah: minorToUah(jar.amount),
    goalUah: typeof jar.goal === "number" && Number.isFinite(jar.goal) ? minorToUah(jar.goal) : null,
    jarUrl: `https://send.monobank.ua/jar/${jarId}`,
    sendId: jarId,
  };
};

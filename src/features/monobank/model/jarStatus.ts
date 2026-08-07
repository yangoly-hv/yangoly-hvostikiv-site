import type { MonobankClientInfo, MonobankJar, MonobankJarStatus } from "./types";

export const minorToUah = (amountMinor: number): number => amountMinor / 100;

export const findJarBySendId = (
  clientInfo: MonobankClientInfo,
  sendId: string,
): MonobankJar | null => {
  const jars = clientInfo.jars;
  if (!Array.isArray(jars)) return null;
  return jars.find((jar) => jar.sendId === sendId) ?? null;
};

export const toJarStatus = (
  jar: MonobankJar,
  jarUrl: string,
  sendId: string,
): MonobankJarStatus => ({
  title: jar.title,
  balanceUah: minorToUah(jar.balance),
  goalUah: typeof jar.goal === "number" ? minorToUah(jar.goal) : null,
  jarUrl,
  sendId,
});

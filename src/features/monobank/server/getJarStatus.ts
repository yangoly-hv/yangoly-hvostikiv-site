import "server-only";

import { unstable_cache } from "next/cache";

import { toJarStatusFromPublic } from "../model/jarStatus";
import { parseLongJarId } from "../model/parseLongJarId";
import type { MonobankJarStatus, MonobankPublicJar } from "../model/types";

const CACHE_SECONDS = 60;

const publicJarUrl = (longJarId: string) =>
  `https://api.monobank.ua/bank/jar/${encodeURIComponent(longJarId)}`;

const loadJarStatus = async (longJarId: string): Promise<MonobankJarStatus | null> => {
  const response = await fetch(publicJarUrl(longJarId), {
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Monobank public jar returned ${response.status}`);
  }

  const payload = (await response.json()) as MonobankPublicJar;
  const status = toJarStatusFromPublic(payload);
  if (!status) {
    console.warn("Monobank jar status skipped: public jar payload incomplete", { longJarId });
    return null;
  }
  return status;
};

/**
 * Resolve Sanity monobankLongJarId into displayable jar status via the public jar API.
 * Returns null on any failure so callers can hide the Mono CTA without breaking the page.
 */
export const getMonobankJarStatus = async (
  longJarId: string | null | undefined,
): Promise<MonobankJarStatus | null> => {
  try {
    const raw = typeof longJarId === "string" ? longJarId : "";
    if (!raw.trim()) {
      console.warn("Monobank jar status skipped: monobankLongJarId is missing");
      return null;
    }

    const id = parseLongJarId(raw);
    if (!id) {
      console.warn("Monobank jar status skipped: invalid longJarId", { longJarId: raw.trim() });
      return null;
    }

    const cached = unstable_cache(
      () => loadJarStatus(id),
      ["monobank-jar-status", id],
      { revalidate: CACHE_SECONDS },
    );
    return await cached();
  } catch (error) {
    console.error("Monobank jar status failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
};

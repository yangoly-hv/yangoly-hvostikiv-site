import "server-only";

import { unstable_cache } from "next/cache";

import { findJarBySendId, toJarStatus } from "../model/jarStatus";
import { parseJarSendId } from "../model/parseJarSendId";
import type { MonobankClientInfo, MonobankJarStatus } from "../model/types";

const CLIENT_INFO_URL = "https://api.monobank.ua/personal/client-info";
const CACHE_SECONDS = 60;

const fetchClientInfo = async (token: string): Promise<MonobankClientInfo> => {
  const response = await fetch(CLIENT_INFO_URL, {
    headers: { "X-Token": token },
    next: { revalidate: CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`Monobank client-info returned ${response.status}`);
  }

  return (await response.json()) as MonobankClientInfo;
};

const loadJarStatus = async (
  jarUrl: string,
  sendId: string,
  token: string,
): Promise<MonobankJarStatus | null> => {
  const clientInfo = await fetchClientInfo(token);
  const jar = findJarBySendId(clientInfo, sendId);
  if (!jar) {
    console.warn("Monobank jar status skipped: jar not found in client-info", { sendId });
    return null;
  }
  return toJarStatus(jar, jarUrl, sendId);
};

/**
 * Resolve public jar URL + MONOBANK_TOKEN into displayable jar status.
 * Returns null on any failure so callers can hide the Mono CTA without breaking the page.
 */
export const getMonobankJarStatus = async (
  jarUrl: string | null | undefined,
): Promise<MonobankJarStatus | null> => {
  try {
    const trimmedUrl = typeof jarUrl === "string" ? jarUrl.trim() : "";
    if (!trimmedUrl) {
      console.warn("Monobank jar status skipped: monobankJarUrl is missing");
      return null;
    }

    const token = process.env.MONOBANK_TOKEN?.trim();
    if (!token) {
      console.warn("Monobank jar status skipped: MONOBANK_TOKEN is not configured");
      return null;
    }

    const sendId = parseJarSendId(trimmedUrl);
    if (!sendId) {
      console.warn("Monobank jar status skipped: invalid jar URL", { jarUrl: trimmedUrl });
      return null;
    }

    const cached = unstable_cache(
      () => loadJarStatus(trimmedUrl, sendId, token),
      ["monobank-jar-status", sendId],
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

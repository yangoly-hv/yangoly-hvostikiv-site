import { isValidMetaExternalId } from "./metaClickIds";

export const META_EXTERNAL_ID_STORAGE_KEY = "meta-external-id";

let memoryExternalId: string | undefined;

const createExternalId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const getMetaExternalId = () => {
  if (typeof window === "undefined") return "";

  try {
    const stored = window.localStorage.getItem(META_EXTERNAL_ID_STORAGE_KEY)?.trim();
    if (stored && isValidMetaExternalId(stored)) return stored;
    const created = createExternalId();
    window.localStorage.setItem(META_EXTERNAL_ID_STORAGE_KEY, created);
    return created;
  } catch {
    if (!memoryExternalId) memoryExternalId = createExternalId();
    return memoryExternalId;
  }
};

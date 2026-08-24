const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

export const getGtmId = () => {
  const raw =
    typeof process.env.NEXT_PUBLIC_GTM_ID === "string"
      ? process.env.NEXT_PUBLIC_GTM_ID.trim()
      : "";
  return GTM_ID_PATTERN.test(raw) ? raw : "";
};

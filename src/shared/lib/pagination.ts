export const getPageNumber = (
  value: string | null | undefined,
  totalPages: number
) => {
  const parsed = Number.parseInt(value || "1", 10);
  if (!Number.isFinite(parsed)) return 1;
  return Math.min(Math.max(parsed, 1), Math.max(totalPages, 1));
};

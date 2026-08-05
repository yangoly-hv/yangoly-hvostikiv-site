import "server-only";

export function toPlainText(value: unknown): string {
  if (typeof value === "string") {
    return value.replace(/\s+/g, " ").trim();
  }

  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .flatMap((block) => {
      if (!block || typeof block !== "object") {
        return [];
      }

      const children = (block as { children?: unknown }).children;
      if (!Array.isArray(children)) {
        return [];
      }

      return children.flatMap((child) =>
        child && typeof child === "object" && typeof (child as { text?: unknown }).text === "string"
          ? [(child as { text: string }).text]
          : []
      );
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncateDescription(value: string, maxLength = 155): string {
  const text = value.replace(/\s+/g, " ").trim();

  if (text.length <= maxLength) {
    return text;
  }

  const clipped = text.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
  return `${clipped || text.slice(0, maxLength).trim()}…`;
}

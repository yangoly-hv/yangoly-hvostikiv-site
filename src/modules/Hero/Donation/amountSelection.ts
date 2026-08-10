export type AmountSelectionMode = "none" | "preset" | "custom";

export function isPresetHighlighted(
  mode: AmountSelectionMode,
  presets: number[],
  amount: number | undefined,
  presetValue: number
): boolean {
  return mode === "preset" && typeof amount === "number" && amount === presetValue && presets.includes(presetValue);
}

export function isCustomHighlighted(mode: AmountSelectionMode): boolean {
  return mode === "custom";
}

import { describe, expect, it } from "vitest";
import { isCustomHighlighted, isPresetHighlighted } from "./amountSelection";

describe("amountSelection", () => {
  const presets = [100, 200, 600, 1500];

  it("highlights no preset before interaction", () => {
    expect(isPresetHighlighted("none", presets, 100, 100)).toBe(false);
    expect(isCustomHighlighted("none")).toBe(false);
  });

  it("highlights only the selected preset after click", () => {
    expect(isPresetHighlighted("preset", presets, 200, 200)).toBe(true);
    expect(isPresetHighlighted("preset", presets, 200, 100)).toBe(false);
    expect(isCustomHighlighted("preset")).toBe(false);
  });

  it("highlights custom mode and not presets", () => {
    expect(isCustomHighlighted("custom")).toBe(true);
    expect(isPresetHighlighted("custom", presets, 350, 100)).toBe(false);
  });
});

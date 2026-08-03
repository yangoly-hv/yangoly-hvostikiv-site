import { readFileSync } from "node:fs";

import { expect, it } from "vitest";

const source = readFileSync(new URL("./HelpTabs.tsx", import.meta.url), "utf8");

it("uses predictable initial tab states", () => {
  expect(source).toMatch(
    /desktopActiveTab[\s\S]*useState\(tabs\[0\]\?\.id \?\? ['"]{2}\)/,
  );
  expect(source).toMatch(/mobileActiveTab[\s\S]*useState\(['"]{2}\)/);
  expect(source).toMatch(/desktopActiveTabData\s*&&/);
});

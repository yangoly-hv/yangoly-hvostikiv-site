import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./HelpTabs.jsx", import.meta.url), "utf8");

assert.match(
  source,
  /desktopActiveTab[\s\S]*useState\(tabs\[0\]\?\.id \?\? ['"]{2}\)/,
  "Desktop tabs should initialize with the first tab open",
);

assert.match(
  source,
  /mobileActiveTab[\s\S]*useState\(['"]{2}\)/,
  "Mobile tabs should initialize with no active tab",
);

assert.match(
  source,
  /desktopActiveTabData\s*&&/,
  "Desktop content should render from desktop tab state",
);

console.log("helpTabsInitialState tests passed");

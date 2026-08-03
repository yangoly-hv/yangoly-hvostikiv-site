import type { PortableTextBlock } from "@portabletext/types";
import { describe, expect, it } from "vitest";

import { buildReportTabsData, TAB_CONFIG } from "./reportTabsData";

const block = (text: string): PortableTextBlock[] => [
  {
    _key: "block",
    _type: "block",
    children: [{ _key: "span", _type: "span", marks: [], text }],
    markDefs: [],
    style: "normal",
  },
];

const completeReport = {
  shortFoodDescription: block("Food short"),
  foodDescription: block("Food full"),
  shortHouseDescription: block("House short"),
  houseDescription: block("House full"),
  shortTherapyDescription: block("Therapy short"),
  therapyDescription: block("Therapy full"),
  shortOtherDescription: block("Other short"),
  otherDescription: block("Other full"),
};

describe("buildReportTabsData", () => {
  it("keeps only tabs with both a short and full description", () => {
    expect(
      buildReportTabsData({ ...completeReport, shortFoodDescription: undefined }).map(
        (tab) => tab.id,
      ),
    ).toEqual(["house", "therapy", "other"]);
    expect(
      buildReportTabsData({ ...completeReport, houseDescription: [] }).map(
        (tab) => tab.id,
      ),
    ).toEqual(["food", "therapy", "other"]);
    expect(
      buildReportTabsData({ ...completeReport, shortOtherDescription: block("   ") }).map(
        (tab) => tab.id,
      ),
    ).toEqual(["food", "house", "therapy"]);
  });

  it("uses locale-specific labels", () => {
    expect(TAB_CONFIG.find((tab) => tab.id === "therapy")?.labels.en.title).toBe(
      "Veterinary care",
    );
    expect(
      buildReportTabsData(completeReport, "en").find((tab) => tab.id === "therapy")?.title,
    ).toBe("Veterinary care");
  });
});

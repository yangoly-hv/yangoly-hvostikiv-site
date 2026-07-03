import assert from "node:assert/strict";
import { buildReportTabsData, TAB_CONFIG } from "./reportTabsData.mjs";

const block = (text) => [
  {
    _type: "block",
    children: [{ _type: "span", text }],
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

assert.equal(TAB_CONFIG.find((tab) => tab.id === "food")?.title, "Допомога кормом");
assert.equal(TAB_CONFIG.find((tab) => tab.id === "other")?.title, "Інше");

assert.deepEqual(
  buildReportTabsData({
    ...completeReport,
    shortFoodDescription: undefined,
  }).map((tab) => tab.id),
  ["house", "therapy", "other"],
);

assert.deepEqual(
  buildReportTabsData({
    ...completeReport,
    houseDescription: [],
  }).map((tab) => tab.id),
  ["food", "therapy", "other"],
);

assert.deepEqual(
  buildReportTabsData({
    ...completeReport,
    shortOtherDescription: block("   "),
  }).map((tab) => tab.id),
  ["food", "house", "therapy"],
);

console.log("reportTabsData tests passed");

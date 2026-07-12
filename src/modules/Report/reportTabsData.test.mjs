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

assert.equal(TAB_CONFIG.find((tab) => tab.id === "food")?.labels.uk.title, "Допомога кормом");
assert.equal(TAB_CONFIG.find((tab) => tab.id === "other")?.labels.uk.title, "Інше");
assert.equal(TAB_CONFIG.find((tab) => tab.id === "therapy")?.labels.uk.title, "Ветеринарна допомога");
assert.equal(TAB_CONFIG.find((tab) => tab.id === "therapy")?.labels.en.title, "Veterinary care");

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

assert.equal(
  buildReportTabsData(completeReport).find((tab) => tab.id === "therapy")?.title,
  "Ветеринарна допомога",
);

assert.equal(
  buildReportTabsData(completeReport, "en").find((tab) => tab.id === "therapy")?.title,
  "Veterinary care",
);

console.log("reportTabsData tests passed");

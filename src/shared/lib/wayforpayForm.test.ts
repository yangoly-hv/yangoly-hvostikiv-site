import { describe, expect, it } from "vitest";

import { getWayforpayFormFields } from "./wayforpayForm";

describe("getWayforpayFormFields", () => {
  it("serializes product arrays as repeated bracketed fields", () => {
    expect(
      getWayforpayFormFields({
        merchantAccount: "merchant",
        productName: ["Food", "Medicine"],
        productPrice: [100, 50],
        productCount: [1, 2],
      }),
    ).toEqual([
      { name: "merchantAccount", value: "merchant" },
      { name: "productName[]", value: "Food" },
      { name: "productName[]", value: "Medicine" },
      { name: "productPrice[]", value: "100" },
      { name: "productPrice[]", value: "50" },
      { name: "productCount[]", value: "1" },
      { name: "productCount[]", value: "2" },
    ]);
  });

  it("never joins product values with semicolons", () => {
    const fields = getWayforpayFormFields({ productName: ["Donation", "Care"] });

    expect(fields).not.toContainEqual({ name: "productName", value: "Donation;Care" });
  });
});

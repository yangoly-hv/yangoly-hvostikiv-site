import { describe, expect, it } from "vitest";
import { imageUrlForSlot } from "./sanityImage";

const framedImage = {
  asset: { _ref: "image-abc123def456-1600x900-jpg" },
  crop: { top: 0.05, bottom: 0.1, left: 0.2, right: 0.05 },
  hotspot: { x: 0.42, y: 0.38, height: 0.85, width: 0.75 },
  url: "https://cdn.sanity.io/images/vintpwoh/production/abc123def456-1600x900.jpg",
};

describe("imageUrlForSlot", () => {
  it("applies the Sanity crop to the requested slot size", () => {
    const url = imageUrlForSlot(framedImage, "tailCard");

    expect(url).toContain("w=600");
    expect(url).toContain("h=500");
    expect(url).toContain("fit=crop");
    expect(url).toContain("rect=");
  });

  it("falls back to a raw URL when no asset ref is present", () => {
    expect(imageUrlForSlot({ url: framedImage.url }, "reportSlider")).toBe(
      framedImage.url
    );
  });
});

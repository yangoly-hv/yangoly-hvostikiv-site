import { describe, expect, it } from "vitest";
import { mapReportImages, normalizeReportDetail } from "./mapReportImages";

const framedImage = {
  asset: { _ref: "image-abc123def456-1600x900-jpg" },
  crop: { top: 0.02, bottom: 0.08, left: 0.1, right: 0.1 },
  hotspot: { x: 0.5, y: 0.4, height: 0.9, width: 0.8 },
  url: "https://cdn.sanity.io/images/vintpwoh/production/abc123def456-1600x900.jpg",
};

describe("mapReportImages", () => {
  it("builds cropped 13:10 URLs from Sanity image objects", () => {
    const [url] = mapReportImages([framedImage]);

    expect(url).toContain("w=1040");
    expect(url).toContain("h=800");
    expect(url).toContain("rect=");
  });

  it("keeps already-resolved URLs", () => {
    expect(mapReportImages([framedImage.url])).toEqual([framedImage.url]);
  });

  it("normalizes a report document to cropped URL strings", () => {
    const report = normalizeReportDetail({
      _id: "report-1",
      slug: "july-2026",
      date: { month: 7, year: 2026 },
      title: "Липень 2026",
      images: [framedImage],
    });

    expect(report?.images).toHaveLength(1);
    expect(report?.images[0]).toContain("w=1040");
    expect(report?.images[0]).toContain("rect=");
  });
});

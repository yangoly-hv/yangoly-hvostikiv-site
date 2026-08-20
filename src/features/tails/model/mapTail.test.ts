import { describe, expect, it } from "vitest";
import { mapTail } from "./mapTail";

const tail = {
  _id: "tail-1",
  name: "Луна",
  slug: "luna",
  description: [],
  sex: "girl" as const,
  needs_family: true,
  needs_sterilization: true,
  mainImageUrl: "https://cdn.sanity.io/luna.jpg",
};

describe("mapTail", () => {
  it("returns a localized, client-safe DTO", () => {
    expect(mapTail(tail, "uk")).toMatchObject({
      id: "tail-1",
      slug: "luna",
      sex: "Дівчинка",
      sterilized: "Нестерилізована",
      categories: ["needs-family", "needs-sterilization"],
      images: ["https://cdn.sanity.io/luna.jpg"],
    });
  });

  it("localizes values without changing domain categories", () => {
    expect(mapTail(tail, "en")).toMatchObject({
      sex: "Girl",
      sterilized: "Not sterilized",
      categories: ["needs-family", "needs-sterilization"],
    });
  });

  it("uses the Sanity crop for card and gallery slots", () => {
    const mapped = mapTail(
      {
        ...tail,
        mainImage: {
          asset: { _ref: "image-abc123def456-1600x900-jpg" },
          crop: { top: 0.05, bottom: 0.1, left: 0.2, right: 0.05 },
          hotspot: { x: 0.42, y: 0.38, height: 0.85, width: 0.75 },
        },
        images: [
          {
            asset: { _ref: "image-fff111aaa222-2000x1500-jpg" },
            crop: { top: 0.1, bottom: 0.1, left: 0.15, right: 0.05 },
            hotspot: { x: 0.5, y: 0.5, height: 0.8, width: 0.8 },
          },
        ],
      },
      "uk"
    );

    expect(mapped.cardImage).toContain("w=600");
    expect(mapped.cardImage).toContain("h=500");
    expect(mapped.cardImage).toContain("rect=");
    expect(mapped.galleryImages[0]).toContain("w=900");
    expect(mapped.galleryImages[0]).toContain("h=750");
    expect(mapped.galleryImages[1]).toContain("w=900");
    expect(mapped.galleryImages[1]).toContain("rect=");
  });
});

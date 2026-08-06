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
});

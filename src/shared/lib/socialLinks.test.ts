import { describe, expect, it } from "vitest";
import { filterSocialLinks, isValidSocialHref } from "./socialLinks";

describe("isValidSocialHref", () => {
  it("accepts matching https hosts", () => {
    expect(isValidSocialHref("instagram", "https://www.instagram.com/yangoli_hvostikiv/")).toBe(
      true
    );
    expect(isValidSocialHref("facebook", "https://facebook.com/YangoliHvostikiv")).toBe(true);
    expect(isValidSocialHref("twitter", "https://x.com/someone")).toBe(true);
    expect(isValidSocialHref("telegram", "https://t.me/channel")).toBe(true);
    expect(isValidSocialHref("youtube", "https://youtu.be/abc")).toBe(true);
  });

  it("rejects empty, relative, and wrong-network urls", () => {
    expect(isValidSocialHref("instagram", "")).toBe(false);
    expect(isValidSocialHref("instagram", "/")).toBe(false);
    expect(isValidSocialHref("telegram", "https://twitter.com/x")).toBe(false);
    expect(isValidSocialHref("facebook", "http://facebook.com/x")).toBe(false);
  });
});

describe("filterSocialLinks", () => {
  it("keeps only valid https network urls in display order", () => {
    expect(
      filterSocialLinks({
        instagram: "https://www.instagram.com/yangoli_hvostikiv/",
        facebook: "https://www.facebook.com/YangoliHvostikiv",
        twitter: "/",
        telegram: "https://twitter.com/wrong",
        youtube: undefined,
      })
    ).toEqual([
      {
        network: "instagram",
        href: "https://www.instagram.com/yangoli_hvostikiv/",
      },
      {
        network: "facebook",
        href: "https://www.facebook.com/YangoliHvostikiv",
      },
    ]);
  });

  it("returns an empty list when settings are missing", () => {
    expect(filterSocialLinks(null)).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { getRevalidationTargets } from "./sanityRevalidation";

describe("getRevalidationTargets", () => {
  it("invalidates only blog list, changed slugs and localized blog URLs", () => {
    const result = getRevalidationTargets({
      _id: "post-1",
      _type: "post",
      operation: "update",
      oldSlug: "old-post",
      newSlug: "new-post",
    });

    expect(result.tags).toEqual([
      "blog:list",
      "sitemap",
      "blog:old-post",
      "blog:new-post",
    ]);
    expect(result.paths).toEqual([
      "/uk/blog",
      "/en/blog",
      "/uk/blog/old-post",
      "/en/blog/old-post",
      "/uk/blog/new-post",
      "/en/blog/new-post",
    ]);
    expect(result.tags).not.toContain("tails:list");
    expect(result.tags).not.toContain("reports:list");
  });

  it.each([
    ["tail", "tails:list", "/uk/tails"],
    ["reports", "reports:list", "/uk/reporting"],
    ["donator", "donors:list", "/uk"],
    ["collection", "collection:main", "/uk"],
    ["perfomance", "performance", "/uk"],
    ["partner", "partners:list", "/uk/partnership"],
    ["aboutFoundation", "about", "/uk"],
    ["events", "events", "/uk/charity-events"],
    ["siteSettings", "siteSettings", "/uk"],
  ] as const)("maps %s to its domain tag and path", (type, tag, path) => {
    const result = getRevalidationTargets({
      _id: `${type}-1`,
      _type: type,
      operation: "update",
      newSlug: "item",
    });

    expect(result.tags).toContain(tag);
    expect(result.paths).toContain(path);
  });

  it("deduplicates identical old and new slugs", () => {
    const result = getRevalidationTargets({
      _id: "tail-1",
      _type: "tail",
      oldSlug: "same",
      newSlug: "same",
    });

    expect(result.tags.filter((tag) => tag === "tail:same")).toHaveLength(1);
    expect(result.paths.filter((path) => path.endsWith("/same"))).toHaveLength(2);
  });

  it("invalidates both localized partnership pages when a partner changes", () => {
    const result = getRevalidationTargets({
      _id: "partner-1",
      _type: "partner",
      operation: "delete",
    });

    expect(result.tags).toEqual(["partners:list"]);
    expect(result.paths).toEqual(["/uk/partnership", "/en/partnership"]);
  });
});

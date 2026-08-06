import { describe, expect, it } from "vitest";

import { contactSubmissionSchema } from "./schema";

describe("contactSubmissionSchema", () => {
  it("normalizes a valid contact request and strips unknown fields", () => {
    const result = contactSubmissionSchema.parse({
      name: "  Anna  Maria ",
      phone: "+38 (067) 123-45-67",
      message: "  Please call me \r\nsoon ",
      website: "",
      source: "contact-page",
      ignored: "value",
    });

    expect(result).toEqual({
      name: "Anna Maria",
      phone: "+38 (067) 123-45-67",
      message: "Please call me \nsoon",
      website: "",
      source: "contact-page",
    });
  });

  it("rejects phone numbers without a Ukrainian 0XX code", () => {
    expect(() =>
      contactSubmissionSchema.parse({
        name: "Anna",
        phone: "+38 (167) 123-45-67",
        message: "",
        website: "",
        source: "contact-page",
      }),
    ).toThrow("PHONE_INVALID");
  });

  it("rejects invalid names and filled honeypots", () => {
    expect(() =>
      contactSubmissionSchema.parse({
        name: "!!!",
        phone: "+38 (067) 123-45-67",
        message: "",
        website: "bot.example",
        source: "contact-page",
      }),
    ).toThrow();
  });
});

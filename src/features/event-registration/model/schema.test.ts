import { describe, expect, it } from "vitest";

import { eventRegistrationSubmissionSchema } from "./schema";

const validBase = {
  fullName: "  Іван  Петренко ",
  email: "  ivan@example.com ",
  phone: "+38 (067) 123-45-67",
  petType: "dog" as const,
  petName: "  Барсик ",
  comments: "  Hello \r\nworld ",
  website: "",
  locale: "uk" as const,
};

describe("eventRegistrationSubmissionSchema", () => {
  it("normalizes a valid registration", () => {
    expect(eventRegistrationSubmissionSchema.parse(validBase)).toEqual({
      fullName: "Іван Петренко",
      email: "ivan@example.com",
      phone: "+38 (067) 123-45-67",
      petType: "dog",
      petName: "Барсик",
      comments: "Hello \nworld",
      website: "",
      locale: "uk",
    });
  });

  it("accepts cat pet type and empty comments", () => {
    expect(
      eventRegistrationSubmissionSchema.parse({
        ...validBase,
        petType: "cat",
        comments: "",
        locale: "en",
      }),
    ).toMatchObject({
      petType: "cat",
      comments: "",
      locale: "en",
    });
  });

  it("rejects invalid email and phone", () => {
    expect(() =>
      eventRegistrationSubmissionSchema.parse({
        ...validBase,
        email: "not-an-email",
      }),
    ).toThrow("EMAIL_INVALID");

    expect(() =>
      eventRegistrationSubmissionSchema.parse({
        ...validBase,
        phone: "+38 (167) 123-45-67",
      }),
    ).toThrow("PHONE_INVALID");
  });

  it("rejects missing pet type and filled honeypot", () => {
    expect(() =>
      eventRegistrationSubmissionSchema.parse({
        ...validBase,
        petType: undefined,
      }),
    ).toThrow();

    expect(() =>
      eventRegistrationSubmissionSchema.parse({
        ...validBase,
        website: "bot.example",
      }),
    ).toThrow();
  });
});

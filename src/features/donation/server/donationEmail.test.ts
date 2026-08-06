import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  sendEmail: vi.fn(),
  patch: vi.fn(),
  patchSet: vi.fn(),
  patchInc: vi.fn(),
  patchCommit: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.sendEmail };
  },
}));
vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({
    patch(id: string) {
      mocks.patch(id);
      return {
        set(value: unknown) {
          mocks.patchSet(value);
          return {
            inc(value: unknown) {
              mocks.patchInc(value);
              return { commit: mocks.patchCommit };
            },
          };
        },
      };
    },
  }),
}));

import {
  createDonationEmail,
  deliverDonationEmail,
  getDonationPurposeLabel,
  type DonationEmailOrder,
} from "./donationEmail";

const order: DonationEmailOrder = {
  _id: "donateOrder.DONATE_123",
  orderReference: "DONATE_123",
  occurrenceId: "paymentOccurrence.123",
  amountMinor: 100_050,
  currency: "UAH",
  donationPurpose: "collection",
  donationTargetName: "Збір на лікування",
  donorFullName: "Олексій Коваленко",
  comment: "На <лікування>",
  donationEmailEnabled: true,
  donationEmailStatus: "pending",
  providerTransactionStatus: "Approved",
  lastProviderProcessingAt: "2026-08-04T08:00:00.000Z",
};

describe("donation email", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("RESEND_API_KEY", "resend-key");
    vi.stubEnv("CONTACT_EMAIL_TO", "payments@example.org");
    vi.stubEnv("CONTACT_EMAIL_FROM", "Foundation <payments@example.org>");
    mocks.sendEmail.mockResolvedValue({ data: { id: "email-1" }, error: null });
    mocks.patchCommit.mockResolvedValue({});
  });

  afterEach(() => vi.unstubAllEnvs());

  it.each([
    ["foundation", "Підтримка роботи фонду"],
    ["collection", "Пожертва на збір: Збір"],
    ["tail-one-time", "Разова допомога хвостику: Луна"],
    ["tail-guardianship", "Опіка хвостика: Луна"],
  ] as const)("formats %s purpose", (purpose, expected) => {
    const target = purpose === "foundation" ? "Підтримка роботи фонду" : purpose === "collection" ? "Збір" : "Луна";

    expect(getDonationPurposeLabel(purpose, target)).toBe(expected);
  });

  it("escapes user fields and hides the name of an anonymous donor", () => {
    const email = createDonationEmail({
      ...order,
      isAnonymous: true,
      donorFullName: "<script>alert(1)</script>",
    });

    expect(email.subject).toContain("Пожертва на збір");
    expect(email.html).toContain("Анонімно");
    expect(email.html).toContain("&lt;лікування&gt;");
    expect(email.html).not.toContain("alert(1)");
  });

  it("includes the selected Hero donation item when it is available", () => {
    const email = createDonationEmail({
      ...order,
      donationItemDescription: "1 день харчування цуценятка / кошенятка",
    });

    expect(email.html).toContain("Обрана допомога:");
    expect(email.html).toContain("1 день харчування цуценятка / кошенятка");
    expect(email.text).toContain("Обрана допомога: 1 день харчування цуценятка / кошенятка");
  });

  it("sends one idempotent email and records successful delivery", async () => {
    await expect(deliverDonationEmail(order)).resolves.toBe("sent");

    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ["payments@example.org"],
        subject: expect.stringContaining("Пожертва на збір"),
      }),
      { idempotencyKey: "wayforpay-donation-paymentOccurrence.123" },
    );
    expect(mocks.patchSet).toHaveBeenCalledWith(
      expect.objectContaining({ donationEmailStatus: "sent", donationEmailProviderId: "email-1" }),
    );
  });

  it("keeps a failed email pending for reconciliation", async () => {
    mocks.sendEmail.mockResolvedValue({ data: null, error: { message: "Unavailable" } });

    await expect(deliverDonationEmail(order)).resolves.toBe("failed");

    expect(mocks.patchSet).toHaveBeenCalledWith(
      expect.objectContaining({
        donationEmailStatus: "pending",
        donationEmailLastErrorCode: "RESEND_SEND_FAILED",
      }),
    );
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getRequiredEnv: vi.fn(),
  fetch: vi.fn(),
  delete: vi.fn(),
  commit: vi.fn(),
}));

vi.mock("@/shared/lib/env.server", () => ({ getRequiredEnv: mocks.getRequiredEnv }));
vi.mock("@/shared/lib/sanity.payments", () => ({
  getPaymentsClient: () => ({
    fetch: mocks.fetch,
    transaction: () => ({
      delete: mocks.delete,
      commit: mocks.commit,
    }),
  }),
}));

import { GET } from "./route";

describe("GET /api/wayforpay/cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getRequiredEnv.mockReturnValue("cleanup-secret");
    mocks.fetch.mockResolvedValue([]);
    mocks.commit.mockResolvedValue({});
  });

  it("requires the cron secret", async () => {
    const response = await GET(new Request("https://example.org/api/wayforpay/cleanup"));

    expect(response.status).toBe(401);
    expect(mocks.fetch).not.toHaveBeenCalled();
  });

  it("deletes only the IDs returned by the abandoned-order query", async () => {
    mocks.fetch.mockResolvedValue(["donateOrder.old-1", "donateOrder.old-2"]);
    const response = await GET(
      new Request("https://example.org/api/wayforpay/cleanup", {
        headers: { Authorization: "Bearer cleanup-secret" },
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ deleted: 2 });
    expect(mocks.delete).toHaveBeenNthCalledWith(1, "donateOrder.old-1");
    expect(mocks.delete).toHaveBeenNthCalledWith(2, "donateOrder.old-2");
    expect(mocks.commit).toHaveBeenCalledOnce();
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({ revalidatePath: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { POST } from "./route";

const request = (token?: string) =>
  new NextRequest("http://localhost/api/revalidate/all", {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

describe("POST /api/revalidate/all", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.REVALIDATE_OPS_SECRET = "ops-secret";
  });

  it("rejects an invalid operator token", async () => {
    expect((await POST(request("wrong"))).status).toBe(401);
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("invalidates the complete route tree", async () => {
    expect((await POST(request("ops-secret"))).status).toBe(200);
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});

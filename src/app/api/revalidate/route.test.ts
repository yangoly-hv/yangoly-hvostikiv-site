import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  parseBody: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
  revalidateTag: mocks.revalidateTag,
}));
vi.mock("next-sanity/webhook", () => ({ parseBody: mocks.parseBody }));

import { POST } from "./route";

const request = (headers: Record<string, string> = {}) =>
  new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    headers: {
      "sanity-project-id": "vintpwoh",
      "sanity-dataset": "production",
      "sanity-operation": "update",
      "sanity-transaction-id": "tx-1",
      ...headers,
    },
    body: "{}",
  });

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SANITY_REVALIDATE_SECRET = "test-secret";
    mocks.parseBody.mockResolvedValue({
      isValidSignature: true,
      body: {
        _id: "post-1",
        _type: "post",
        oldSlug: "before",
        newSlug: "after",
      },
    });
  });

  it("rejects an invalid signature", async () => {
    mocks.parseBody.mockResolvedValue({ isValidSignature: false, body: null });
    expect((await POST(request())).status).toBe(401);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it.each(["create", "update", "delete"])(
    "accepts the Sanity %s operation",
    async (operation) => {
      const response = await POST(request({ "sanity-operation": operation }));
      expect(response.status).toBe(200);
      expect(mocks.revalidateTag).toHaveBeenCalled();
    }
  );

  it("rejects the wrong project or dataset", async () => {
    expect((await POST(request({ "sanity-project-id": "other" }))).status).toBe(403);
    expect(mocks.parseBody).not.toHaveBeenCalled();
  });

  it("rejects an unsupported document type", async () => {
    mocks.parseBody.mockResolvedValue({
      isValidSignature: true,
      body: { _id: "other-1", _type: "unknown" },
    });
    expect((await POST(request())).status).toBe(400);
  });

  it("invalidates both localized detail URLs on a slug change", async () => {
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledWith("blog:list", { expire: 0 });
    expect(mocks.revalidateTag).toHaveBeenCalledWith("blog:before", { expire: 0 });
    expect(mocks.revalidateTag).toHaveBeenCalledWith("blog:after", { expire: 0 });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/uk/blog/after");
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/en/blog/after");
    expect(mocks.revalidateTag).not.toHaveBeenCalledWith("tails:list", expect.anything());
  });

  it("safely handles a repeated delivery", async () => {
    await POST(request());
    await POST(request());
    expect(mocks.revalidatePath).toHaveBeenCalledTimes(12);
  });

  it.each(["drafts.post-1", "versions.release.post-1"])(
    "ignores non-published document %s",
    async (id) => {
      mocks.parseBody.mockResolvedValue({
        isValidSignature: true,
        body: { _id: id, _type: "post", newSlug: "draft" },
      });
      const response = await POST(request());
      expect(await response.json()).toMatchObject({ ignored: true });
      expect(mocks.revalidateTag).not.toHaveBeenCalled();
    }
  );
});

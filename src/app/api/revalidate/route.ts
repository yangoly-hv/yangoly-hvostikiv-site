import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { sanityDataset, sanityProjectId } from "@/shared/lib/sanity.server";
import {
  getRevalidationTargets,
  type SanityWebhookOperation,
  type SanityWebhookPayload,
} from "@/shared/lib/sanityRevalidation";
import { isSupportedSanityDocumentType } from "@/shared/lib/sanityTags";

export const dynamic = "force-dynamic";

const allowedOperations = new Set<SanityWebhookOperation>([
  "create",
  "update",
  "delete",
]);

const isWebhookPayload = (value: unknown): value is SanityWebhookPayload => {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;

  return (
    typeof payload._id === "string" &&
    typeof payload._type === "string" &&
    isSupportedSanityDocumentType(payload._type) &&
    (payload.operation === undefined ||
      (typeof payload.operation === "string" &&
        allowedOperations.has(payload.operation as SanityWebhookOperation))) &&
    (payload.oldSlug === undefined ||
      payload.oldSlug === null ||
      typeof payload.oldSlug === "string") &&
    (payload.newSlug === undefined ||
      payload.newSlug === null ||
      typeof payload.newSlug === "string")
  );
};

const isPublishedDocumentId = (id: string) =>
  !id.startsWith("drafts.") && !id.startsWith("versions.");

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ revalidated: false }, { status: 503 });
  }

  const projectId = request.headers.get("sanity-project-id");
  const dataset = request.headers.get("sanity-dataset");
  const operation = request.headers.get("sanity-operation");
  const transactionId = request.headers.get("sanity-transaction-id");

  if (projectId !== sanityProjectId || dataset !== sanityDataset) {
    return NextResponse.json({ revalidated: false }, { status: 403 });
  }

  const { body, isValidSignature } = await parseBody<unknown>(
    request,
    secret,
    true
  );

  if (!isValidSignature) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }

  const payloadWithOperation =
    body && typeof body === "object"
      ? { ...body, operation: operation || undefined }
      : body;

  if (!isWebhookPayload(payloadWithOperation)) {
    return NextResponse.json({ revalidated: false }, { status: 400 });
  }

  if (!isPublishedDocumentId(payloadWithOperation._id)) {
    console.info("Sanity non-published change ignored", {
      transactionId,
      operation: payloadWithOperation.operation,
      documentType: payloadWithOperation._type,
    });
    return NextResponse.json({ revalidated: false, ignored: true });
  }

  const targets = getRevalidationTargets(payloadWithOperation);

  for (const tag of targets.tags) {
    revalidateTag(tag, { expire: 0 });
  }

  for (const path of targets.paths) {
    revalidatePath(path);
  }

  console.info("Sanity content revalidated", {
    transactionId,
    operation: payloadWithOperation.operation,
    documentType: payloadWithOperation._type,
    tagCount: targets.tags.length,
    pathCount: targets.paths.length,
  });

  return NextResponse.json({
    revalidated: true,
    tags: targets.tags,
    paths: targets.paths,
  });
}

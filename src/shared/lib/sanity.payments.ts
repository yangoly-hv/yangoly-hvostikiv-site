import "server-only";

import { createClient } from "@sanity/client";

import { getRequiredEnv } from "./env.server";

export const getPaymentsClient = () =>
  createClient({
    projectId: getRequiredEnv("NEXT_PUBLIC_SANITY_PROJECT_ID"),
    dataset: getRequiredEnv("SANITY_PAYMENTS_DATASET"),
    apiVersion: process.env.SANITY_API_VERSION || "2025-05-15",
    token: getRequiredEnv("SANITY_PAYMENTS_TOKEN"),
    useCdn: false,
    perspective: "published",
  });

import "server-only";

import { cache } from "react";
import type { AppLocale } from "@/shared/config/site";
import { sanityFetch } from "@/shared/lib/sanity.server";
import { sanityTags } from "@/shared/lib/sanityTags";
import type {
  AboutFoundation,
  Donor,
  MainCollection,
  Performance,
} from "../model/types";
import {
  aboutFoundationQuery,
  mainCollectionQuery,
  performanceQuery,
  topDonorsQuery,
} from "./queries";

export const getPerformance = cache(() =>
  sanityFetch<Performance | null>(performanceQuery, {}, {
    tags: [sanityTags.performance],
  })
);

export const getTopDonors = cache((locale: AppLocale) =>
  sanityFetch<Donor[]>(topDonorsQuery, { lang: locale }, {
    tags: [sanityTags.donorsList],
  })
);

export const getMainCollection = cache(() =>
  sanityFetch<MainCollection | null>(mainCollectionQuery, {}, {
    tags: [sanityTags.collectionMain],
  })
);

export const getAboutFoundation = cache((locale: AppLocale) =>
  sanityFetch<AboutFoundation | null>(
    aboutFoundationQuery,
    { lang: locale },
    { tags: [sanityTags.about] }
  )
);

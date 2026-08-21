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
  TopDonor,
  Volunteer,
} from "../model/types";
import {
  aboutFoundationQuery,
  mainCollectionQuery,
  performanceQuery,
  topDonorBoardQuery,
  topDonorsQuery,
  volunteersQuery,
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

export const getTopDonorBoard = cache((locale: AppLocale) =>
  sanityFetch<TopDonor[]>(topDonorBoardQuery, { lang: locale }, {
    tags: [sanityTags.donorsList],
  })
);

export const getVolunteers = cache((locale: AppLocale) =>
  sanityFetch<Volunteer[]>(volunteersQuery, { lang: locale }, {
    tags: [sanityTags.volunteersList],
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

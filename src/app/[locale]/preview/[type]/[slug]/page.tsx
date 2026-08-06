import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import BlogArticle from "@/modules/BlogArticle/BlogArticle";
import BlogArticleWithContent from "@/modules/BlogArticle/BlogArticleWithContent";
import Report from "@/modules/Report/Report";
import Tail from "@/modules/Tail/Tail";
import type { BlogPost } from "@/features/blog/model/types";
import { postBySlugQuery } from "@/features/blog/server/queries";
import { formatReportDate } from "@/features/reports/model/formatReportDate";
import type { ReportDetail } from "@/features/reports/model/types";
import { reportBySlugQuery } from "@/features/reports/server/queries";
import { mapTail } from "@/features/tails/model/mapTail";
import type { TailDocument } from "@/features/tails/model/types";
import { tailBySlugQuery } from "@/features/tails/server/queries";
import type { AppLocale } from "@/shared/config/site";
import { sanityPreviewFetch } from "@/shared/lib/sanityPreview.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Draft preview",
  robots: { index: false, follow: false },
};

type PreviewPageProps = {
  params: Promise<{
    locale: AppLocale;
    type: "blog" | "tails" | "reporting";
    slug: string;
  }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  if (!(await draftMode()).isEnabled) notFound();

  const { locale, type, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  if (type === "blog") {
    const post = await sanityPreviewFetch<BlogPost | null>(postBySlugQuery, {
      lang: locale,
      slug,
    });
    if (!post) notFound();
    const translation = t.raw("Blog");
    return Array.isArray(post.content) && post.content.length ? (
      <BlogArticleWithContent article={post} translation={translation} />
    ) : (
      <BlogArticle article={post} translation={translation} />
    );
  }

  if (type === "tails") {
    const tail = await sanityPreviewFetch<TailDocument | null>(tailBySlugQuery, {
      lang: locale,
      slug,
    });
    if (!tail) notFound();
    return (
      <Tail
        tail={mapTail(tail, locale)}
        randomTails={[]}
        locale={locale}
        translation={t.raw("Tails")}
      />
    );
  }

  if (type === "reporting") {
    const report = await sanityPreviewFetch<ReportDetail | null>(
      reportBySlugQuery,
      { lang: locale, slug }
    );
    if (!report) notFound();
    return (
      <Report
        report={{
          ...report,
          date:
            typeof report.date === "string"
              ? report.date
              : formatReportDate(report.date, locale),
        }}
        translation={t.raw("Reporting")}
        locale={locale}
      />
    );
  }

  notFound();
}

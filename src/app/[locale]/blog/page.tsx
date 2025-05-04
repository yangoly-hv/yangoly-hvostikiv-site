import Blog from "@/modules/Blog/Blog";
import Contacts from "@/modules/Contacts/Contacts";
import { IMetadata, PageParams } from "@/shared/types";
import type { Metadata } from "next";

import { getAllBlogItems } from "@/shared/api/blog";
import { Suspense } from "react";
import Loading from "@/app/loading";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const metadata = (await t.raw("blog")) as IMetadata;
  const { locale } = await params;
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: `${baseUrl}/${locale}/blog`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
  };
}

export default async function BlogPage({ params }: PageParams) {
  const t = await getTranslations("");
  const blog = await t.raw("Blog");
  const { locale } = await params;

  const data = await getAllBlogItems(locale);

  if (!data) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Blog data={data} translation={blog} />
        <Contacts />
      </Suspense>
    </>
  );
}

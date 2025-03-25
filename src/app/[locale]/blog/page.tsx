import Blog from "@/modules/Blog/Blog";
import Contacts from "@/modules/Contacts/Contacts";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
import type { Metadata } from "next";

import { getAllBlogItems } from "@/shared/api/blog";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

  return {
    title: metadata.blog.title,
    description: metadata.blog.description,
    keywords: metadata.blog.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: metadata.blog.title,
      description: metadata.blog.description,
      url: `${baseUrl}/${locale}/blog`,
      type: "website",
      locale: locale,
      images: [
        {
          url: "/images/about/about-us-desk3.jpg",
          width: 1200,
          height: 630,
          alt: metadata.blog.title,
        },
      ],
    },
  };
}

export default async function BlogPage({ params }: PageParams) {
  const { locale } = await params;
  const { blog, contacts } = await getDictionary(locale);

  const data = await getAllBlogItems(locale);

  if (!data) {
    return null;
  }

  return (
    <>
      <Blog data={data} translation={blog} />
      <Contacts translation={contacts} lang={locale} />
    </>
  );
}

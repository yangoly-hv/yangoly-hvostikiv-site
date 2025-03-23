import Contacts from "@/modules/Contacts/Contacts";
import Tails from "@/modules/Tails/Tails";
import { getDictionary } from "@/shared/utils";
import { PageParams } from "@/shared/types";
import type {Metadata} from "next";

export async function generateMetadata({
                                           params,
                                       }: PageParams): Promise<Metadata> {
    const { locale } = await params;
    const { metadata } = await getDictionary(locale);
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv.vercel.app";

    return {
        title: metadata.tails.title,
        description: metadata.tails.description,
        keywords: metadata.tails.keywords,
        icons: {
            icon: "/favicon.ico",
        },
        openGraph: {
            title: metadata.tails.title,
            description: metadata.tails.description,
            url: `${baseUrl}/${locale}/tails`,
            type: "website",
            locale: locale,
            images: [
                {
                    url: "/images/about/about-us-desk3.jpg",
                    width: 1200,
                    height: 630,
                    alt: metadata.tails.title,
                },
            ],
        },
    };
}

export default async function TailsPage({ params }: PageParams) {
  const { locale } = await params;
  const { contacts, tails } = await getDictionary(locale);

  return (
    <>
      <Tails translation={tails} lang={locale} />
      <Contacts translation={contacts} lang={locale} />
    </>
  );
}

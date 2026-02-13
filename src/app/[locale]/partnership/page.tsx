import PartnershipHero from "@/shared/components/PartnershipHero/PartnershipHero";
import PartnersList from "@/shared/components/PartnersList/PartnersList";
import PartnershipHelpCards from "@/shared/components/PartnershipHelpCards/PartnershipHelpCards";
import PartnershipBenefitsForYou from "@/modules/PartnershipBenefitsForYou/PartnershipBenefitsForYou";
import Contacts from "@/modules/Contacts/Contacts";
import { Metadata } from "next";
import { IMetadata, PageParams } from "@/shared/types";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Loading from "@/app/loading";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  const metadata = (await t.raw("partnership")) as IMetadata;
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
export default async function ParnershipPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <PartnershipHero />
        <PartnershipHelpCards />
        <PartnershipBenefitsForYou />
        <PartnersList />
        <Contacts />
      </Suspense>
    </>
  );
}

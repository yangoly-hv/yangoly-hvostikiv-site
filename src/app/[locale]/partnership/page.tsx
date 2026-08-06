import PartnershipHero from "@/shared/components/PartnershipHero/PartnershipHero";
import PartnersList from "@/modules/PartnersList/PartnersList";
import PartnershipHelpCards from "@/shared/components/PartnershipHelpCards/PartnershipHelpCards";
import PartnershipBenefitsForYou from "@/modules/PartnershipBenefitsForYou/PartnershipBenefitsForYou";
import Contacts from "@/modules/Contacts/Contacts";
import { Metadata } from "next";
import { PageParams } from "@/shared/types";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getPageMetadata } from "@/shared/lib/metadata";
import { getWebPageSchema } from "@/shared/lib/structuredData";
import JsonLd from "@/shared/components/JsonLd";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "partnership", path: "/partnership" });
}
export default async function ParnershipPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const metadata = t.raw("partnership") as { title: string; description: string };
  return (
    <>
      <JsonLd data={getWebPageSchema({ locale, path: "/partnership", name: metadata.title, description: metadata.description })} />
      <PartnershipHero />
      <PartnershipHelpCards />
      <PartnershipBenefitsForYou />
      <PartnersList />
      <Contacts />
    </>
  );
}

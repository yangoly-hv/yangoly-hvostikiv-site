import PartnershipHero from "@/shared/components/PartnershipHero/PartnershipHero";
import PartnersList from "@/shared/components/PartnersList/PartnersList";
import PartnershipHelpCards from "@/shared/components/PartnershipHelpCards/PartnershipHelpCards";
import PartnershipBenefitsForYou from "@/modules/PartnershipBenefitsForYou/PartnershipBenefitsForYou";
import Contacts from "@/modules/Contacts/Contacts";
import { Metadata } from "next";
import { PageParams } from "@/shared/types";
import { setRequestLocale } from "next-intl/server";
import { getPageMetadata } from "@/shared/lib/metadata";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({ locale, key: "partnership", path: "/partnership" });
}
export default async function ParnershipPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PartnershipHero />
      <PartnershipHelpCards />
      <PartnershipBenefitsForYou />
      <PartnersList />
      <Contacts />
    </>
  );
}

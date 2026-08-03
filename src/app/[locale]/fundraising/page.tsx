import Hero from "../../../shared/components/ChairtyBlocks/Hero";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageParams } from "@/shared/types";
import { Metadata } from "next";
import { getPageMetadata } from "@/shared/lib/metadata";


export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata({
    locale,
    key: "charityEvents",
    path: "/fundraising",
  });
}

export default async function CharityEventPage({ params }: PageParams) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "CharityEvents" });
  return (
    <section className="bg-orange-bg">
        <Hero title={t("title")} images={[]} />
    </section>
  );
}

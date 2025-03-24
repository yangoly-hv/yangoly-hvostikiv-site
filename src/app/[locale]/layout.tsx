import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Header from "@/modules/Header/Header";
import Footer from "@/modules/Footer/Footer";
import { getDictionary } from "@/shared/utils";
import { LocaleLayoutProps, PageParams } from "@/shared/types";
import "../globals.css";

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } = await params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://yangoly-hvostikiv-site.vercel.app";

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
      url: `${baseUrl}/${locale}`,
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

const raleway = Raleway({
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-raleway",
  subsets: ["latin", "cyrillic"],
});

export default async function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  const { locale } = await params;
  const { header, footerNav, donateModal } = await getDictionary(locale);

  return (
    <div className="relative">
      <Header
        lang={locale}
        translation={header}
        donateModalTranslataion={donateModal}
      />
      <div className="flex flex-col min-h-[100%]">
        <main
          className={`${raleway.variable} bg-orange-bg h-full flex-1 w-full overflow-y-hidden overflow-x-hidden font-raleway`}
        >
          {children}
        </main>
        <Footer translation={footerNav} />
      </div>
    </div>
  );
}

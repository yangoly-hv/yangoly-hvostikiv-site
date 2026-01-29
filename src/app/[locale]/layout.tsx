import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Header from "@/modules/Header/Header";
import Footer from "@/modules/Footer/Footer";
import { getDictionary } from "@/shared/utils";
import ModalProvider from "@/providers/ModalProvider";
import { LocaleLayoutProps } from "@/shared/types";
import PaymentReturnClient from "@/shared/components/PaymentReturnHandler/PaymentReturnClient";
import "../globals.css";

export type PageParams = {
  params: {
    locale: "uk" | "en";
    id?: string;
    slug?: string;
  };
};

      export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { locale } =  params;
  const { metadata } = await getDictionary(locale);
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://yangoly-hvostikiv-site.vercel.app";

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
}: Readonly<LocaleLayoutProps>) {
  return (
      <ModalProvider>
        <div className="flex flex-col min-h-screen">
          <Header/>
          <PaymentReturnClient />
          <main
              className={`${raleway.variable} bg-orange-bg flex-1 w-full overflow-x-hidden font-raleway`}
          >
            {children}
          </main>
          <Footer/>
        </div>
      </ModalProvider>

  );
}

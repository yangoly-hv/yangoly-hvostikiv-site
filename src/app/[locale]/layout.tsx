import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/modules/Header/Header";
import Footer from "@/modules/Footer/Footer";
import ModalProvider from "@/providers/ModalProvider";
import { LocaleLayoutProps, LocalePageParams } from "@/shared/types";
import PaymentReturnClient from "@/shared/components/PaymentReturnHandler/PaymentReturnClient";
import { locales } from "@/shared/config/site";
import { getPageMetadata } from "@/shared/lib/metadata";
import { getOrganizationSchema } from "@/shared/lib/structuredData";
import JsonLd from "@/shared/components/JsonLd";
import MotionProvider from "@/shared/ui/MotionProvider";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocalePageParams<string>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locales, locale)) return {};
  return getPageMetadata({ locale });
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
  if (!hasLocale(locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const clientMessages = {
    Header: messages.Header,
    Filters: messages.Filters,
    ContactModal: messages.ContactModal,
    DonateModal: messages.DonateModal,
    DonationForm: messages.DonationForm,
    ThankYouModal: messages.ThankYouModal,
    PaymentReturn: messages.PaymentReturn,
    CheckoutError: messages.CheckoutError,
    KeepingModal: messages.KeepingModal,
  };

  return (
    <html lang={locale}>
      <body>
        <JsonLd data={getOrganizationSchema(locale)} />
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
            <ModalProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <PaymentReturnClient />
                <main
                  className={`${raleway.variable} bg-orange-bg flex-1 w-full overflow-x-hidden font-raleway`}
                >
                  {children}
                </main>
                <Footer />
              </div>
            </ModalProvider>
            <div id="modal-root" />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

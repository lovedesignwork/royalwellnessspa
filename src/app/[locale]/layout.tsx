import type { Metadata } from "next";
import { Crimson_Text, Work_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

const crimsonText = Crimson_Text({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Wellness Spa | Luxury Massage & Spa in Phuket",
  description:
    "Indulge in a tranquil spa experience at Royal Wellness Spa, 3rd Floor Royal Phuket City Hotel. Expert massage techniques, premium aromatic oils. Open Daily 10:00 – 23:00.",
  keywords:
    "spa phuket, massage phuket, wellness spa, thai massage, luxury spa, royal wellness spa, royal phuket city hotel, สปาภูเก็ต, นวดภูเก็ต",
  openGraph: {
    title: "Royal Wellness Spa | Luxury Massage & Spa in Phuket",
    description:
      "Indulge in a tranquil spa experience designed to restore balance to both body and mind.",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "th")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${crimsonText.variable} ${workSans.variable} ${ibmPlexSansThai.variable} antialiased ${
          locale === "th" ? "font-thai" : ""
        }`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

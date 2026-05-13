import type { Metadata } from "next";
import { Crimson_Text, Work_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Royal Wellness Spa | Luxury Massage & Spa in Phuket",
  description: "Indulge in a tranquil spa experience at Royal Wellness Spa, 3rd Floor Royal Phuket City Hotel. Expert massage techniques, premium aromatic oils. Open Daily 10:00 – 22:00.",
  keywords: "spa phuket, massage phuket, wellness spa, thai massage, luxury spa, royal wellness spa, royal phuket city hotel",
  openGraph: {
    title: "Royal Wellness Spa | Luxury Massage & Spa in Phuket",
    description: "Indulge in a tranquil spa experience designed to restore balance to both body and mind.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${crimsonText.variable} ${workSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

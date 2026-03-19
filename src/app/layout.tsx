import type { Metadata } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Wellness Spa | Luxury Massage & Spa in Phuket",
  description: "Indulge in a tranquil spa experience at Royal Wellness Spa, Phuket. Expert massage techniques, premium aromatic oils, and a serene escape for body and mind. Open 10AM - 11PM.",
  keywords: "spa phuket, massage phuket, wellness spa, thai massage, luxury spa, royal wellness spa",
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
        className={`${libreBaskerville.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

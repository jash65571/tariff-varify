import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TariffVerify — Instant Tariff Exposure Analysis",
  description:
    "Upload your Bill of Materials, get AI-powered HS code classification, and visualize your tariff exposure across countries. Built for manufacturers and importers.",
  keywords: [
    "tariff",
    "HS code",
    "import duty",
    "BOM analysis",
    "trade compliance",
    "tariff exposure",
  ],
  openGraph: {
    title: "TariffVerify — Instant Tariff Exposure Analysis",
    description:
      "Upload your Bill of Materials, get AI-powered HS code classification, and visualize your tariff exposure across countries.",
    siteName: "TariffVerify",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        {children}
      </body>
    </html>
  );
}

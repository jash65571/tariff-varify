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
  metadataBase: new URL("https://tariffverify.com"),
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TariffVerify — Instant Tariff Exposure Analysis",
    description:
      "Upload your Bill of Materials, get AI-powered HS code classification, and visualize your tariff exposure across countries.",
    siteName: "TariffVerify",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
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

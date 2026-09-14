import Footer from "@/app/_components/footer";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import cn from "classnames";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Instrument_Serif, Libre_Franklin, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal","italic"], variable: "--font-serif" });
const sans  = Libre_Franklin({ subsets: ["latin"], variable: "--font-sans" });
const mono  = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500","600"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: `Un sito di fantacalcio`,
  description: `Il sito della lega di fantacalcio Andre Chiurco.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#000000"
        />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#efe6d2" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body
 className={`${serif.variable} ${sans.variable} ${mono.variable} font-sans bg-paper text-ink`}>
       <Analytics />
        <SpeedInsights />
        <div className="paper-vignette pointer-events-none fixed inset-0 z-50" aria-hidden="true" />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

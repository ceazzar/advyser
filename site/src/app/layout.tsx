import "./globals.css";

import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

import { CookieConsentBanner } from "@/components/composite/cookie-consent";
import { SkipLink } from "@/components/ui/skip-link";
import { AuthProvider } from "@/lib/auth-context";
import { ShortlistProvider } from "@/lib/shortlist-context";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Advyser",
  description: "Find your perfect financial or property advisor",
  openGraph: {
    title: "Advyser",
    description: "Find your perfect financial or property advisor",
    url: siteUrl,
    siteName: "Advyser",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advyser",
    description: "Find your perfect financial or property advisor",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} font-sans antialiased`}>
        <SkipLink />
        <AuthProvider>
          <ShortlistProvider>
            <main id="main-content">{children}</main>
            <CookieConsentBanner />
          </ShortlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

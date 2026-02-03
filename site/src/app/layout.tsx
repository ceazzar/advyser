import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { SkipLink } from "@/components/ui/skip-link";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: "Advyser",
  description: "Find your perfect financial or property advisor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} font-sans antialiased`}
      >
        <SkipLink />
        <AuthProvider>
          <ShortlistProvider>
            <main id="main-content">
              {children}
            </main>
          </ShortlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

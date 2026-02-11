import type { Metadata } from "next";
import "./globals.css";
import { ShortlistProvider } from "@/lib/shortlist-context";
import { SkipLink } from "@/components/ui/skip-link";

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
      <body className="font-sans antialiased">
        <SkipLink />
        <ShortlistProvider>
          <main id="main-content">{children}</main>
        </ShortlistProvider>
      </body>
    </html>
  );
}

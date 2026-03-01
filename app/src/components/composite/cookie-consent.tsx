"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { readCookieConsent, writeCookieConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = readCookieConsent();
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const setConsent = (choice: "accepted" | "essential") => {
    writeCookieConsent(choice);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential browser storage to keep the platform secure and remember your
          consent preferences. Optional storage helps us improve the experience. Read our{" "}
          <Link href="/cookies" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/cookies">Review</Link>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setConsent("essential")}>
            Essential only
          </Button>
          <Button size="sm" onClick={() => setConsent("accepted")}>
            Accept optional
          </Button>
        </div>
      </div>
    </div>
  );
}

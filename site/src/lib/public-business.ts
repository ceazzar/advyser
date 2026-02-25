export const publicBusiness = {
  legalName: process.env.NEXT_PUBLIC_BUSINESS_LEGAL_NAME?.trim() || "Advyser Pty Ltd",
  abn: process.env.NEXT_PUBLIC_BUSINESS_ABN?.trim() || null,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "support@advyser.com.au",
  privacyEmail: process.env.NEXT_PUBLIC_PRIVACY_EMAIL?.trim() || "privacy@advyser.com.au",
  legalEmail: process.env.NEXT_PUBLIC_LEGAL_EMAIL?.trim() || "legal@advyser.com.au",
  mediaEmail:
    process.env.NEXT_PUBLIC_MEDIA_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_LEGAL_EMAIL?.trim() ||
    "legal@advyser.com.au",
  complaintsEmail:
    process.env.NEXT_PUBLIC_COMPLAINTS_EMAIL?.trim() ||
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
    "support@advyser.com.au",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE?.trim() || null,
  supportHours:
    process.env.NEXT_PUBLIC_SUPPORT_HOURS?.trim() ||
    "Mon-Fri 9:00am-5:00pm Sydney time (AEST/AEDT)",
  postalAddress: process.env.NEXT_PUBLIC_POSTAL_ADDRESS?.trim() || null,
  legalAddress:
    process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() ||
    process.env.NEXT_PUBLIC_POSTAL_ADDRESS?.trim() ||
    null,
} as const;

export const publicMessaging = {
  noPlaceholderLegalCopy:
    "Business registration details and postal contact are available on request.",
} as const;

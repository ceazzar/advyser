import Link from "next/link"

import { cn } from "@/lib/utils"

const footerLinks = [
  { href: "/help", label: "Help" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

interface DashboardFooterProps {
  className?: string
}

export function DashboardFooter({ className }: DashboardFooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className={cn(
        "border-t border-border/40 bg-muted/30 px-4 py-4",
        className
      )}
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 sm:flex-row">
        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} Advyser. All rights reserved.
        </p>

        {/* Links */}
        <nav className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

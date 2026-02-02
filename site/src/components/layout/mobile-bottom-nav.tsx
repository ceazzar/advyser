"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
  items: {
    label: string
    href: string
    icon: React.ReactNode
  }[]
  activeHref?: string
}

export function MobileBottomNav({ items, activeHref }: MobileBottomNavProps) {
  // Limit to 5 navigation items max
  const navItems = items.slice(0, 5)

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "h-16 bg-white border-t border-border",
        "md:hidden",
        "safe-area-pb"
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <ul className="flex h-full items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = activeHref === item.href

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-full py-2 px-1",
                  "transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "rounded-md",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex items-center justify-center",
                    "[&>svg]:h-5 [&>svg]:w-5",
                    isActive && "[&>svg]:stroke-[2.5]"
                  )}
                >
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium leading-none truncate max-w-full",
                    isActive && "font-semibold"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

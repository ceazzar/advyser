"use client"

import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

interface MobileBottomNavProps {
  items: {
    label: string
    href: string
    icon: React.ReactNode
  }[]
  activeHref?: string
}

// Progressive enhancement: haptic feedback (Android only, no-op on iOS Safari)
function triggerHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(10) // 10ms light tap
  }
}

export function MobileBottomNav({ items, activeHref }: MobileBottomNavProps) {
  // Limit to 4 navigation items max (reduced from 5 for better thumb targets)
  const navItems = items.slice(0, 4)
  const [activeIndex, setActiveIndex] = React.useState(0)

  // Calculate active index for animated indicator
  React.useEffect(() => {
    const index = navItems.findIndex((item) => item.href === activeHref)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }, [activeHref, navItems])

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "h-16 bg-background/95 backdrop-blur border-t border-border",
        "md:hidden",
        "safe-area-pb"
      )}
      role="navigation"
      aria-label="Mobile navigation"
    >
      {/* Animated indicator */}
      <div
        className="absolute top-0 h-0.5 bg-primary transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          width: `${100 / navItems.length}%`,
          left: `${(activeIndex * 100) / navItems.length}%`,
        }}
      />

      <ul className="flex h-full items-center justify-around px-2">
        {navItems.map((item, index) => {
          const isActive = activeHref === item.href

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                onClick={() => {
                  triggerHaptic()
                  setActiveIndex(index)
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-full py-2 px-1",
                  "transition-all duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "rounded-md",
                  "active:scale-95", // Press feedback
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
                    "transition-transform duration-150",
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

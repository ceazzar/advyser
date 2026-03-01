"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { getDefaultRouteForRole } from "@/lib/auth-routing"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/search", label: "Find Advisors" },
  { href: "/resources", label: "Resources" },
  { href: "/for-advisors", label: "For Advisors" },
]

export function PublicHeader() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()
  const dashboardHref = user ? getDefaultRouteForRole(user.role) : "/"

  // V.1.4.3: Track scroll position for dynamic shadow
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    // Check initial scroll position
    handleScroll()

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // V.1.4.4: Check if a link is active
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-shadow duration-200",
        isScrolled && "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        {/* Left section: Logo + Nav */}
        <div className="flex items-center gap-7">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Advyser
            </span>
          </Link>

          {/* Desktop Navigation - grouped with logo like Wise */}
          <nav className="hidden items-center lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex min-h-11 items-center rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none",
                  isActiveLink(link.href)
                    ? "font-semibold text-primary"
                    : "font-medium text-gray-900"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section: Help + Auth CTA */}
        <div className="hidden items-center lg:flex">
          <Link
            href="/help"
            className={cn(
              "flex min-h-11 items-center rounded-lg px-3 py-2 text-base transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none",
              isActiveLink("/help")
                ? "font-bold text-primary"
                : "font-semibold text-gray-900"
            )}
          >
            Help
          </Link>
          {isLoading ? (
            <div className="ml-1 h-11 w-48" aria-hidden="true" />
          ) : user ? (
            <>
              <Link
                href={dashboardHref}
                className={cn(
                  "ml-1 flex min-h-11 items-center rounded-lg px-3 py-2 text-base transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none",
                  isActiveLink(dashboardHref)
                    ? "font-bold text-primary"
                    : "font-semibold text-gray-900"
                )}
              >
                Dashboard
              </Link>
              <Button
                type="button"
                variant="outline"
                className="ml-2 rounded-full"
                onClick={logout}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(
                  "ml-1 flex min-h-11 items-center rounded-lg px-3 py-2 text-base transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none",
                  isActiveLink("/login")
                    ? "font-bold text-primary"
                    : "font-semibold text-gray-900"
                )}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="ml-2 inline-flex h-11 min-h-11 items-center justify-center rounded-full bg-primary px-4 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] pt-12">
              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center text-lg focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none",
                      isActiveLink(link.href)
                        ? "font-bold text-primary"
                        : "font-semibold text-gray-900"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/help"
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center text-lg focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none",
                    isActiveLink("/help")
                      ? "font-bold text-primary"
                      : "font-semibold text-gray-900"
                  )}
                >
                  Help
                </Link>
                <div className="mt-4 flex flex-col gap-3 border-t pt-6">
                  {isLoading ? null : user ? (
                    <>
                      <Button asChild variant="outline" className="w-full rounded-full">
                        <Link href={dashboardHref} onClick={() => setIsOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full rounded-full"
                        onClick={() => {
                          setIsOpen(false)
                          void logout()
                        }}
                      >
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="w-full rounded-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Log in
                        </Link>
                      </Button>
                      <Button asChild className="w-full rounded-full">
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          Sign up
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className="w-full rounded-full">
                        <Link href="/search" onClick={() => setIsOpen(false)}>
                          Find an Advisor
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

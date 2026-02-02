"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"

const navLinks = [
  { href: "/search", label: "Find Advisors" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/for-advisors", label: "For Advisors" },
]

export function PublicHeader() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
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
                className="flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section: Help, Login/Dashboard, CTA */}
        <div className="hidden items-center lg:flex">
          <Link
            href="/help"
            className="flex min-h-11 items-center rounded-lg px-3 py-2 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4"
          >
            Help
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === "advisor" ? "/advisor" : user.role === "admin" ? "/admin" : "/dashboard"}
                className="flex min-h-11 items-center rounded-lg px-3 py-2 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex min-h-11 items-center rounded-lg px-3 py-2 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-900/5 focus-visible:underline focus-visible:underline-offset-4"
            >
              Log in
            </Link>
          )}
          <Link
            href="/search"
            className="ml-2 inline-flex h-11 min-h-11 items-center justify-center rounded-full bg-primary px-4 text-base font-semibold text-white transition-colors hover:bg-primary/90"
          >
            Find an Advisor
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
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
                  className="flex min-h-11 items-center text-lg font-semibold text-gray-900"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/help"
                onClick={() => setIsOpen(false)}
                className="flex min-h-11 items-center text-lg font-semibold text-gray-900"
              >
                Help
              </Link>
              <div className="mt-4 flex flex-col gap-3 border-t pt-6">
                {user ? (
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link
                        href={user.role === "advisor" ? "/advisor" : user.role === "admin" ? "/admin" : "/dashboard"}
                        onClick={() => setIsOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false)
                        logout()
                      }}
                    >
                      <LogOut className="size-4 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                )}
                <Button asChild className="w-full rounded-full">
                  <Link href="/search" onClick={() => setIsOpen(false)}>
                    Find an Advisor
                  </Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

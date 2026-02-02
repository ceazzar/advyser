"use client"

import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      {/* Left side - Branding/Illustration (hidden on mobile) */}
      <div className="hidden bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-white">Advyser</span>
        </Link>

        {/* Illustration/Content Area */}
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* Abstract illustration */}
          <div className="relative">
            <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative z-10 rounded-2xl bg-white/10 p-8 backdrop-blur-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-medium">Financial Advisors</p>
                    <p className="text-xs text-white/70">Expert guidance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-medium">Property Advisors</p>
                    <p className="text-xs text-white/70">Real estate experts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="text-white">
          <p className="text-lg font-medium">Find your perfect advisor</p>
          <p className="mt-1 text-sm text-white/70">
            Connect with trusted financial and property experts
          </p>
        </div>
      </div>

      {/* Right side - Auth form content */}
      <div className="flex min-h-screen flex-col lg:min-h-0">
        {/* Mobile logo */}
        <div className="flex h-16 items-center px-6 lg:hidden">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Advyser</span>
          </Link>
        </div>

        {/* Form content - centered */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-[400px]">
            {/* Title and description */}
            {(title || description) && (
              <div className="mb-8 text-center">
                {title && (
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Children (form content) */}
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { Users, Heart, Shield, BadgeCheck, Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

export interface TrustStripProps {
  advisorCount?: number
  clientCount?: number
  showSecurityBadges?: boolean
  showPartnerLogos?: boolean
  className?: string
}

interface StatItemProps {
  icon: React.ReactNode
  value: string
  label: string
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center size-10 rounded-full bg-gray-100 text-gray-600">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

interface SecurityBadgeProps {
  icon: React.ReactNode
  label: string
}

function SecurityBadge({ icon, label }: SecurityBadgeProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <div className="flex items-center justify-center size-8 rounded-md bg-muted text-muted-foreground">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  )
}

function PartnerLogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center h-8 px-4 rounded bg-muted/50 border border-border/50">
      <span className="text-xs font-medium text-muted-foreground">{name}</span>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M+`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K+`
  }
  return `${num}+`
}

function TrustStrip({
  advisorCount = 2500,
  clientCount = 50000,
  showSecurityBadges = true,
  showPartnerLogos = true,
  className,
}: TrustStripProps) {
  return (
    <section
      className={cn(
        "w-full py-6 bg-muted/30 border-y border-border/50",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Stats Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <StatItem
              icon={<Users className="size-5" />}
              value={formatNumber(advisorCount)}
              label="Trusted advisors"
            />

            <Separator
              orientation="vertical"
              className="hidden sm:block h-10"
            />

            <StatItem
              icon={<Heart className="size-5" />}
              value={formatNumber(clientCount)}
              label="Happy clients"
            />
          </div>

          {/* Security Badges */}
          {showSecurityBadges && (
            <>
              <Separator
                orientation="vertical"
                className="hidden lg:block h-10"
              />

              <div className="flex items-center gap-6">
                <SecurityBadge
                  icon={<Lock className="size-4" />}
                  label="SSL Secured"
                />
                <SecurityBadge
                  icon={<BadgeCheck className="size-4" />}
                  label="Verified"
                />
                <SecurityBadge
                  icon={<Shield className="size-4" />}
                  label="ASIC Regulated"
                />
              </div>
            </>
          )}

          {/* Partner Logos */}
          {showPartnerLogos && (
            <>
              <Separator
                orientation="vertical"
                className="hidden lg:block h-10"
              />

              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  Featured in:
                </span>
                <div className="flex items-center gap-3">
                  <PartnerLogoPlaceholder name="Forbes" />
                  <PartnerLogoPlaceholder name="WSJ" />
                  <PartnerLogoPlaceholder name="Bloomberg" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export { TrustStrip }

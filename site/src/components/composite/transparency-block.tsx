"use client"

import * as React from "react"
import { DollarSign, Users, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Icon Optical Sizing:
 * - Feature icons (DollarSign, Users, ShieldCheck): size-6 (24px) in 56px circles
 * These icons are contained in large circles for emphasis, no optical correction needed.
 */
import { Card, CardContent } from "@/components/ui/card"

export interface TransparencyBlockProps {
  className?: string
}

interface TransparencyItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

function TransparencyItem({ icon, title, description }: TransparencyItemProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

function TransparencyBlock({ className }: TransparencyBlockProps) {
  return (
    <section className={cn("w-full py-12", className)}>
      <div className="container mx-auto px-4">
        <Card className="border-none shadow-none bg-muted/30">
          <CardContent className="py-10">
            <div className="flex flex-col gap-8">
              {/* Section Header */}
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  How Advyser makes money
                </h2>
                <p className="mt-2 text-muted-foreground">
                  We believe in complete transparency about our business model
                </p>
              </div>

              {/* 3-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                <TransparencyItem
                  icon={<DollarSign className="size-6" />}
                  title="You pay nothing"
                  description="Finding and connecting with advisors is completely free. No hidden fees, no subscriptions, no premium tiers."
                />

                <TransparencyItem
                  icon={<Users className="size-6" />}
                  title="Advisors pay us"
                  description="Advisors pay a referral fee when they accept a new client through our platform. This is how we fund our service."
                />

                <TransparencyItem
                  icon={<ShieldCheck className="size-6" />}
                  title="We're independent"
                  description="We don't take commissions from financial products. Our recommendations are based solely on advisor quality and fit."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export { TransparencyBlock }

"use client"

import { Mail, Newspaper } from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { publicBusiness } from "@/lib/public-business"

const pressNotes = [
  {
    title: "MVP1 public marketplace launch",
    detail:
      "Advyser is currently focused on public advisor discovery, comparison, and intro-request flows.",
  },
  {
    title: "Advisor platform features",
    detail:
      "Advisor account, inbox, and analytics tooling are planned for a later release phase.",
  },
  {
    title: "Verification positioning",
    detail:
      "Consumers are encouraged to independently validate adviser credentials, including through the ASIC register.",
  },
]

export default function PressPage() {
  return (
    <PublicLayout>
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mx-auto mb-6">
            <Newspaper className="size-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Press & Media</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Official updates for journalists and media partners.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-6">
          {pressNotes.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">{item.title}</h2>
                <p className="text-muted-foreground">{item.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
            <Mail className="size-6" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Media enquiries</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contact us for interviews, background context, or product clarifications.
          </p>

          <Button asChild>
            <Link href={`mailto:${publicBusiness.supportEmail}`}>{publicBusiness.supportEmail}</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}

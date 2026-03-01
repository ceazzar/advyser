import type { LucideIcon } from "lucide-react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { PublicLayout } from "@/components/layouts/public-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PolicyMeta } from "@/lib/policy-meta"
import { formatPolicyDate } from "@/lib/policy-meta"

export interface LegalTocItem {
  id: string
  label: string
}

interface LegalPageShellProps {
  title: string
  summary: string
  icon: LucideIcon
  policy: PolicyMeta
  toc: LegalTocItem[]
  children: React.ReactNode
}

export function LegalPageShell({
  title,
  summary,
  icon: Icon,
  policy,
  toc,
  children,
}: LegalPageShellProps) {
  return (
    <PublicLayout>
      <section className="border-b bg-white py-14 lg:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <Button variant="ghost" size="sm" className="mb-5" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to home
            </Link>
          </Button>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="mt-2 text-muted-foreground">{summary}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border border-border bg-background text-foreground">
                Last updated {formatPolicyDate(policy.lastUpdated)}
              </Badge>
              <Badge className="border border-border bg-background text-foreground">
                Version {policy.version}
              </Badge>
              <Badge className="border border-border bg-background text-foreground">
                {policy.owner}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-[220px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-lg border bg-muted/20 p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">On this page</p>
              <ul className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <article className="prose prose-gray max-w-none [&_h2]:scroll-mt-24">
            {children}
          </article>
        </div>
      </section>
    </PublicLayout>
  )
}

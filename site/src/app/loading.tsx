import { Spinner } from "@/components/ui/spinner"

/**
 * Global loading state for the application.
 * Displayed while page content is being loaded.
 */
export default function GlobalLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

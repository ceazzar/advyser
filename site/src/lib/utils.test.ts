import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("merges class names and resolves conflicting utilities", () => {
    const merged = cn("p-2", "text-sm", "p-4", "font-medium")

    expect(merged).toContain("p-4")
    expect(merged).toContain("text-sm")
    expect(merged).toContain("font-medium")
    expect(merged).not.toContain("p-2")
  })
})

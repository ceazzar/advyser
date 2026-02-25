import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const CORE_MVP1_ROUTES = ["/", "/search", "/request-intro", "/advisors/520e1e3d-e7d6-4224-b9a2-3bc6fc7d92af"] as const;

for (const route of CORE_MVP1_ROUTES) {
  test(`a11y baseline has no critical/serious violations on ${route}`, async ({ page }) => {
    await page.goto(route);

    const { violations } = await new AxeBuilder({ page }).analyze();
    const blockingViolations = violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious"
    );

    expect(
      blockingViolations,
      blockingViolations
        .map((violation) => `${violation.impact}: ${violation.id} (${violation.nodes.length} nodes)`)
        .join("\n")
    ).toEqual([]);
  });
}

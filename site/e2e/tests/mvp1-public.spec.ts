import { expect, test } from "@playwright/test";

test("marketplace discovery flow is available", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /find the right financial advisor/i })).toBeVisible();

  await page.goto("/search");
  await expect(page.getByRole("status")).toContainText(/advisors found/i);

  await page.goto("/request-intro");
  await expect(page.getByText(/matched results or an advisor profile/i).first()).toBeVisible();
});

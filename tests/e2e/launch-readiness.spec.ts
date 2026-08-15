import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders truthful launch state and fails closed without an agent endpoint", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Miten Mehta" })).toBeVisible();
  await expect(page.getByText("Powered by Ewaya")).toBeVisible();
  await expect(page.getByText("Integration verification in progress")).toBeVisible();

  await page.getByLabel("Ask Miten's virtual AI agent").fill("How can open source AI support a GTM program?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("The Virtual Miten service is not available yet.")).toBeVisible();
});

test("has no serious or critical automated accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(
    ({ impact }) => impact === "serious" || impact === "critical",
  );
  expect(blockingViolations).toEqual([]);
});

test("supports keyboard navigation to the primary prompt", async ({ page }) => {
  await page.goto("/");
  for (let index = 0; index < 20; index += 1) {
    if ((await page.evaluate(() => document.activeElement?.id)) === "agent-message") break;
    await page.keyboard.press("Tab");
  }
  await expect(page.getByLabel("Ask Miten's virtual AI agent")).toBeFocused();
});

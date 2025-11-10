import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect h1 to contain the project name
  await expect(page.locator("h1")).toContainText("Qualifica o Seu Professor");
});

test("has welcome message", async ({ page }) => {
  await page.goto("/");

  // Expect page to have welcome text
  await expect(page.getByText("Bem-vindo à plataforma")).toBeVisible();
});


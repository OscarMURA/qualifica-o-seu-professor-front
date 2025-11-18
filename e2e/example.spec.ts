import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("shows title and public CTA", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: /Califica a tu Profesor/i })
    ).toBeVisible();

    await expect(
      page.getByText(/Bienvenido a la plataforma/i)
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Comenzar/i })
    ).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Iniciar/i })
    ).toBeVisible();
  });

  test("navigates to signup when clicking Comenzar", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /Comenzar/i }).click();

    await expect(page).toHaveURL(/\/signup$/);
  });
});


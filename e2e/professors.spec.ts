import { test, expect } from "@playwright/test";

test.describe("Professors list page", () => {
  test("lists and filters professors with mocked API", async ({ page }) => {
    const universities = [
      {
        id: "uni-1",
        name: "Universidad Central",
        country: "Chile",
        city: "Santiago",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "uni-2",
        name: "Universidad del Sur",
        country: "Chile",
        city: "Concepción",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const professors = [
      {
        id: "prof-1",
        name: "Juan Pérez",
        department: "Matemáticas",
        bio: "Profesor de cálculo",
        universityId: "uni-1",
        university: {
          id: "uni-1",
          name: "Universidad Central",
          city: "Santiago",
          country: "Chile",
        },
        averageRating: 4.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "prof-2",
        name: "Ana López",
        department: "Física",
        bio: "Profesora de mecánica",
        universityId: "uni-2",
        university: {
          id: "uni-2",
          name: "Universidad del Sur",
          city: "Concepción",
          country: "Chile",
        },
        averageRating: 3.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const ratings: Record<string, { average: number; count: number }> = {
      "prof-1": { average: 4.5, count: 10 },
      "prof-2": { average: 3.8, count: 5 },
    };

    await page.route("**/api/universities", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(universities),
      });
    });

    await page.route("**/api/professors", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(professors),
      });
    });

    await page.route("**/api/comments/professor/*/rating", async (route) => {
      const url = new URL(route.request().url());
      const parts = url.pathname.split("/");
      const professorIndex = parts.indexOf("professor");
      const professorId =
        professorIndex !== -1 ? parts[professorIndex + 1] : "";
      const rating = ratings[professorId] ?? { average: 0, count: 0 };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(rating),
      });
    });

    await page.goto("/professors");

    await expect(
      page.getByRole("heading", { level: 1, name: /Lista de Profesores/i })
    ).toBeVisible();

    await expect(page.getByText("Juan Pérez")).toBeVisible();
    await expect(page.getByText("Ana López")).toBeVisible();

    const searchInput = page.getByPlaceholder(
      "Buscar por nombre, depto o universidad..."
    );

    await searchInput.fill("Ana");

    await expect(page.getByText("Ana López")).toBeVisible();
    await expect(page.getByText("Juan Pérez")).not.toBeVisible();

    await searchInput.fill("");

    const universitySelect = page.getByLabel("Universidad:");
    await universitySelect.selectOption({ label: "Universidad Central" });

    await expect(page.getByText("Juan Pérez")).toBeVisible();
    await expect(page.getByText("Ana López")).not.toBeVisible();
  });
});


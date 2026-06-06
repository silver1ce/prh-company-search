import { expect, test } from "@playwright/test";

test.describe("PRH Company Search", () => {
  test("search by company name shows results", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Yrityksen nimi").fill("Nokia Oyj");
    await page.getByRole("button", { name: "Hae yrityksiä" }).click();

    await expect(page.getByText("Nokia Oyj")).toBeVisible({ timeout: 15_000 });
  });

  test("search by Y-tunnus shows single result", async ({ page }) => {
    await page.goto("/");

    await page.getByLabel("Y-tunnus").fill("0112038-9");
    await page.getByRole("button", { name: "Hae yrityksiä" }).click();

    await expect(page.getByText("0112038-9")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Nokia Oyj")).toBeVisible();
  });

  test("clicking row expands detail panel", async ({ page }) => {
    await page.goto("/?business_id=0112038-9");

    await expect(page.getByText("Nokia Oyj")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("cell", { name: "Nokia Oyj" }).click();

    await expect(page.getByText("Verkkosivu:")).toBeVisible();
  });

  test("pagination loads page 2", async ({ page }) => {
    await page.goto("/?name=Nokia");

    await expect(
      page.getByRole("table", { name: "Hakutulokset" }),
    ).toBeVisible({ timeout: 15_000 });

    const nextButton = page.getByRole("button", { name: "Seuraava sivu" });
    await expect(nextButton).toBeEnabled();
    await nextButton.click();
    await expect(page).toHaveURL(/page=2/);
  });

  test("empty submit shows validation error", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Hae yrityksiä" }).click();

    await expect(page.getByRole("alert")).toHaveText(
      "Anna yrityksen nimi tai Y-tunnus",
    );
  });
});

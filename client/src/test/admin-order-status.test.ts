import { test, expect } from "@playwright/test";

test("admin can change order status", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByLabel("Email")
    .fill("test@test.com");

  await page
    .getByLabel("Password")
    .fill("Test123!");

  await page.getByRole("button", {
    name: "Login",
  }).click();

  // najpierw czekamy aż login faktycznie się zakończy
  await expect(page).toHaveURL(
    "http://localhost:5173/products"
  );

  // dopiero teraz admin dashboard
  await page.goto("/admin");

  await expect(page).toHaveURL(
    "http://localhost:5173/admin"
  );

  await expect(
    page.getByRole("heading", {
      name: "Admin Dashboard",
    })
  ).toBeVisible();

  const firstOrderHeading = page
    .getByRole("heading", {
      name: /order #/i,
    })
    .first();

  await expect(firstOrderHeading).toBeVisible();

  const firstOrder = firstOrderHeading.locator("..");

  const statusSelect =
    firstOrder.locator("select");

  await expect(statusSelect).toBeVisible();

  const currentStatus =
    await statusSelect.inputValue();

  const nextStatus =
    currentStatus === "processing"
      ? "shipped"
      : "processing";

  await statusSelect.selectOption(nextStatus);

  await expect(statusSelect).toHaveValue(
    nextStatus
  );

  await page.reload();

  await expect(
    page.getByRole("heading", {
      name: "Admin Dashboard",
    })
  ).toBeVisible();

  const firstOrderAfterReload = page
    .getByRole("heading", {
      name: /order #/i,
    })
    .first()
    .locator("..");

  await expect(
    firstOrderAfterReload.locator("select")
  ).toHaveValue(nextStatus);
});
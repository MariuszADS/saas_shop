import { test, expect } from "@playwright/test";

test("user can add product to cart", async ({ page }) => {
  await page.goto("/login");

  await page
    .getByLabel("Email")
    .fill("test@user.com");

  await page
    .getByLabel("Password")
    .fill("Test123!");

  await page.getByRole("button", {
    name: "Login",
  }).click();

  await expect(page).toHaveURL(
    "http://localhost:5173/products"
  );

  const firstProduct =
    page.locator("article").first();

  await expect(firstProduct).toBeVisible();

  await firstProduct
    .getByRole("button", {
      name: /add to cart/i,
    })
    .click();

  await page.getByRole("link", {
    name: /cart/i,
  }).click();

  await expect(page).toHaveURL(
    "http://localhost:5173/cart"
  );
});
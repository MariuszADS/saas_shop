
import { test, expect } from "@playwright/test";

test("user can login", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  await page.getByLabel("Email").fill("test@user.com");
  await page.getByLabel("Password").fill("Test123!");

  await page.getByRole("button", {
    name: "Login",
  }).click();

  await expect(page).toHaveURL(
    "http://localhost:5173/products"
  );
  page.on("response", async (response) => {
    if (response.url().includes("/api/auth/login")) {
      console.log(
        "LOGIN STATUS:",
        response.status()
      );

      console.log(
        "LOGIN RESPONSE:",
        await response.text()
      );
    }
  });
});


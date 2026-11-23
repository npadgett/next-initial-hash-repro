import { test, expect } from "@playwright/test";

// A link clicked before hydration is a full page load, which hides the bug.
async function load(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
}

async function follow(page, href) {
  await page.locator(`a[href="${href}"]`).click();
  await expect(page).toHaveURL(href);
}

test.describe("first page load with a fragment", () => {
  test("a fragment link back to that route keeps one fragment", async ({
    page,
  }) => {
    await load(page, "/s?q=1#a");
    await follow(page, "/s?q=1&page=2");
    await follow(page, "/s?q=1#a"); // actual: /s?q=1#a#a
  });

  test("a link back to that route without a fragment has none", async ({
    page,
  }) => {
    await load(page, "/s?q=1#a");
    await follow(page, "/s?q=1&page=2");
    await follow(page, "/s?q=1"); // actual: /s?q=1#a
  });
});

test("first page load without a fragment (control)", async ({ page }) => {
  await load(page, "/s?q=1");
  await follow(page, "/s?q=1&page=2");
  await follow(page, "/s?q=1#a");
  await follow(page, "/s?q=1&page=2");
  await follow(page, "/s?q=1");
});

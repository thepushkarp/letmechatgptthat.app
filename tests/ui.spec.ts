import { test, expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
  // Never submit the test question to ChatGPT, even when playback redirects automatically.
  await context.route("https://chatgpt.com/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<h1>ChatGPT destination intercepted</h1>",
    })
  );
});

test("create, preview, copy, and invalidate a share link", async ({
  page,
  context,
}, testInfo) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const question = page.getByRole("textbox", { name: "Your question" });
  const submit = page.getByRole("button", { name: "Create link" });
  await expect(submit).toBeDisabled();
  await expect(question).not.toBeFocused();
  await expect(page.getByRole("button", { name: "Attach file" })).toHaveCount(
    0
  );
  await page.screenshot({
    path: testInfo.outputPath("landing.png"),
    fullPage: true,
  });
  await question.fill("Why is the sky blue?");
  await question.press("Shift+Enter");
  await question.pressSequentially("Explain simply.");
  await question.press("Enter");
  const link = page.getByRole("textbox", { name: "Shareable link" });
  await expect(link).toBeVisible();
  const url = await link.inputValue();
  expect(url).toMatch(/\/s\/[^/]+$/);
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Copied", exact: true })
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(url);
  await page.screenshot({
    path: testInfo.outputPath("result.png"),
    fullPage: true,
  });
  const popupPromise = page.waitForEvent("popup");
  await page
    .getByRole("link", { name: "Preview (opens in a new tab)" })
    .click();
  const popup = await popupPromise;
  await expect(
    popup.getByRole("textbox", { name: "Question", exact: true })
  ).toContainText("Explain simply.");
  await popup.close();
  await question.fill("A different question");
  await expect(link).toHaveCount(0);
});

test("IME, duplicate submission, failure, and retry", async ({ page }) => {
  let calls = 0;
  let finish: () => void = () => {};
  await page.route("**/api/shorten", async (route) => {
    calls++;
    if (calls === 1) {
      await new Promise<void>((resolve) => {
        finish = resolve;
      });
      await route.fulfill({ status: 500, json: { error: "Test failure" } });
    } else
      await route.fulfill({
        json: { code: "fixture", url: "http://127.0.0.1:4173/s/fixture" },
      });
  });
  await page.goto("/");
  const question = page.getByRole("textbox", { name: "Your question" });
  await question.fill("你好 🌈");
  await question.dispatchEvent("compositionstart");
  await question.dispatchEvent("keydown", { key: "Enter", isComposing: true });
  expect(calls).toBe(0);
  await question.dispatchEvent("compositionend");
  await question.press("Enter");
  await expect.poll(() => calls).toBe(1);
  await expect(
    page.getByRole("button", { name: "Create link" })
  ).toBeDisabled();
  await question.press("Enter");
  expect(calls).toBe(1);
  finish();
  await expect(page.getByRole("alert")).toContainText("Try again");
  await expect(question).toHaveValue("你好 🌈");
  await page.getByRole("button", { name: "Create link" }).click();
  await expect(
    page.getByRole("textbox", { name: "Shareable link" })
  ).toBeVisible();
  expect(calls).toBe(2);
});

test("character boundary and denied clipboard preserve the input", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: () => Promise.reject(new Error("Clipboard denied")) },
    })
  );
  await page.goto("/");
  const question = page.getByRole("textbox", { name: "Your question" });
  const submit = page.getByRole("button", { name: "Create link" });
  await question.fill("a".repeat(2001));
  await expect(submit).toBeDisabled();
  await expect(question).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("alert")).toContainText("2,000");
  await question.fill("a".repeat(2000));
  await expect(submit).toBeEnabled();
  await submit.click();
  await page.getByRole("button", { name: "Copy", exact: true }).click();
  await expect(page.getByRole("status")).toContainText(["", "Couldn’t copy"]);
  const link = page.getByRole("textbox", { name: "Shareable link" });
  await expect(link).toBeFocused();
  expect(
    await link.evaluate(
      (element: HTMLInputElement) =>
        element.selectionEnd! - element.selectionStart!
    )
  ).toBe((await link.inputValue()).length);
  await expect(
    page.getByRole("button", { name: "Copied", exact: true })
  ).toHaveCount(0);
});

test("playback steps, pointer, countdown and encoded redirect", async ({
  page,
}, testInfo) => {
  const query = "你好 🌈\nWhy & how?";
  await page.clock.install();
  await page.goto("/?q=" + encodeURIComponent(query));
  const playback = page.locator(".playback-layout");
  await expect(playback).toHaveAttribute("data-phase", "idle");
  await page.clock.runFor(650);
  await expect(playback).toHaveAttribute("data-phase", "cursorToInput");
  const pointer = testInfo.project.name.startsWith("mobile")
    ? page.locator(
        ".browser-frame > div[aria-hidden=true]:not(.browser-chrome)"
      )
    : page.locator(".browser-frame > svg");
  await expect(pointer.first()).toHaveCSS("opacity", "1");
  await page.clock.runFor(2500);
  await expect(
    page.locator(".simulated-input > span[aria-hidden]")
  ).toContainText(query);
  await page.clock.runFor(2000);
  await expect(playback).toHaveAttribute("data-phase", "waiting");
  await expect(page.getByText("Was that so hard?")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Send to ChatGPT" })
  ).toBeEnabled();
  await page.screenshot({
    path: testInfo.outputPath("playback.png"),
    fullPage: true,
  });
  await page.clock.runFor(5300);
  await expect(page.locator("html")).toHaveAttribute(
    "data-test-redirect",
    "https://chatgpt.com/?q=" + encodeURIComponent(query)
  );
});

test("reduced motion, long text, skip, and keyboard navigation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.clock.install();
  const query = "A long line 🌈\n".repeat(100);
  await page.goto("/?q=" + encodeURIComponent(query));
  await expect(page.locator(".playback-layout")).toHaveAttribute(
    "data-phase",
    "waiting"
  );
  await expect(
    page.locator(".simulated-input > span[aria-hidden]")
  ).toContainText(query.trim());
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  await expect(
    page.getByRole("button", { name: "Open ChatGPT", exact: true })
  ).toBeInViewport();
  await page.getByRole("link", { name: "Create your own link" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("http://127.0.0.1:4173/");
  await page.goto("/?q=skip");
  await page.getByRole("button", { name: "Open ChatGPT", exact: true }).click();
  await page.clock.runFor(300);
  await expect(page.locator("html")).toHaveAttribute(
    "data-test-redirect",
    "https://chatgpt.com/?q=skip"
  );
  await page.goto("/?q=focused-question");
  await expect(page.locator(".playback-layout")).toHaveAttribute(
    "data-phase",
    "waiting"
  );
  const mockQuestion = page.getByRole("textbox", {
    name: "Question",
    exact: true,
  });
  await mockQuestion.press("Shift+Enter");
  await expect(page.locator(".playback-layout")).toHaveAttribute(
    "data-phase",
    "waiting"
  );
  await mockQuestion.press("Enter");
  await page.clock.runFor(300);
  await expect(page.locator("html")).toHaveAttribute(
    "data-test-redirect",
    "https://chatgpt.com/?q=focused-question"
  );
});

test("system themes, FAQ, expired link, icons, and narrow reflow", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  for (const [theme, color] of [
    ["light", "rgb(255, 255, 255)"],
    ["dark", "rgb(13, 13, 13)"],
  ] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await expect(page.locator("body")).toHaveCSS("background-color", color);
  }
  await page.emulateMedia({
    colorScheme: testInfo.project.name.endsWith("light") ? "light" : "dark",
  });
  await page.getByRole("link", { name: "FAQ", exact: true }).click();
  const disclosure = page
    .locator("summary")
    .filter({ hasText: "How do I create a link?" });
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText(/Type your question and press Enter/)
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("faq.png"),
    fullPage: true,
  });
  await page.goto("/s/missing");
  await expect(
    page.getByRole("heading", { name: "Link not found" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Create a new link" }).click();
  await expect(
    page.getByRole("textbox", { name: "Your question" })
  ).toBeVisible();
  for (const path of ["/icon", "/apple-icon"]) {
    const response = await page.request.get(path);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  }
  await page.setViewportSize({ width: 320, height: 568 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  ).toBe(true);
  await expect(
    page.getByRole("button", { name: "Create link" })
  ).toBeInViewport();
});

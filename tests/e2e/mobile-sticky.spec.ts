import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 812 } });

test('mobile: sticky CTA visible and scrolls to #test', async ({ page }) => {
  await page.goto('/');

  const sticky = page.locator('a[href="#test"]:has-text("Пройти")').last();
  await expect(sticky).toBeVisible();

  // Скроллим вниз, чтобы sticky оставалась на экране
  await page.mouse.wheel(0, 1500);
  await expect(sticky).toBeVisible();

  // Клик скроллит к квизу (force: bypass overlap with section overlays)
  await sticky.click({force: true});
  await page.waitForTimeout(800); // нативный smooth-scroll
  const quiz = page.locator('#test');
  await expect(quiz).toBeInViewport();
});


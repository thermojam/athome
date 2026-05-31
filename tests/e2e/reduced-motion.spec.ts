import { test, expect } from '@playwright/test';

test.use({ colorScheme: 'dark', reducedMotion: 'reduce' });

test('reduced-motion: all sections visible without animation block', async ({ page }) => {
  await page.goto('/');

  // Hero виден сразу
  await expect(page.locator('h1')).toBeVisible();

  // Карточки Problem видны без скролла-обёртки Reveal
  await page.locator('#pain').scrollIntoViewIfNeeded();
  const cards = page.locator('#pain li');
  await expect(cards).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    await expect(cards.nth(i)).toBeVisible();
  }

  // Квиз доступен (первый вопрос виден)
  await page.locator('#test').scrollIntoViewIfNeeded();
  await expect(page.locator('#test')).toContainText('Что для тебя сейчас важнее всего?');
});

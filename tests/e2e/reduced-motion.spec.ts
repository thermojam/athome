import { test, expect } from '@playwright/test';

test.use({ colorScheme: 'dark', reducedMotion: 'reduce' });

test('reduced-motion: all sections visible without animation block', async ({ page }) => {
  await page.goto('/');

  // Hero виден сразу
  await expect(page.locator('h1')).toBeVisible();

  // Карточки Problem видны без скролла-обёртки Reveal
  await page.locator('#pain').scrollIntoViewIfNeeded();
  const cards = page.locator('#pain .card-md');
  await expect(cards).toHaveCount(3);
  for (let i = 0; i < 3; i++) {
    await expect(cards.nth(i)).toBeVisible();
  }

  // Квиз доступен (первый вопрос виден)
  await page.locator('#test').scrollIntoViewIfNeeded();
  await expect(page.locator('#test')).toContainText('Что для тебя сейчас важнее всего?');
});

test('радар в LocationMap имеет CSS animation: none при reduced-motion', async ({browser}) => {
    const context = await browser.newContext({reducedMotion: 'reduce'});
    const page = await context.newPage();
    await page.goto('/');

    const ring = page.locator('#map .radar-ring').first();
    await ring.scrollIntoViewIfNeeded();

    const animation = await ring.evaluate((el) => getComputedStyle(el).animationName);
    // При reduced-motion CSS-правило перекрывает animation на none
    expect(animation === 'none' || animation === '').toBeTruthy();

    await context.close();
});

import { test, expect } from '@playwright/test';

test('Hero CTA → quiz → result → TG link', async ({ page }) => {
  await page.goto('/');

  // Hero виден
  await expect(page.locator('h1')).toContainText('Зал в пяти минутах');

  // Скроллим к квизу
  await page.locator('#test').scrollIntoViewIfNeeded();

  // Проходим 3 вопроса — выбираем первый вариант в каждом (health, health, health)
  for (let i = 0; i < 3; i++) {
    const buttons = page.locator('#test button');
    await buttons.first().click();
  }

  // Видим заголовок профиля «здоровье»
  await expect(page.locator('#test')).toContainText('Тебе важно вернуть телу рабочее состояние');

  // TG-кнопка
  const tgLink = page.locator('#test a[href^="https://t.me/"]');
  await expect(tgLink).toBeVisible();
  const href = await tgLink.getAttribute('href');
  expect(href).toMatch(/^https:\/\/t\.me\/[^?]+\?text=.+%D0/); // содержит URL-encoded кириллицу
});

test('после Quiz первый bridge ведёт к #objections (v3.3 swap)', async ({page}) => {
    await page.goto('/#test');
    // Берём первую ссылку bridge, идущую СРАЗУ после #test (Reveal-обёртки → используем XPath по document-order)
    const firstBridgeAfterQuiz = page
        .locator('xpath=//section[@id="test"]/following::a[starts-with(@href, "#")][1]');
    await firstBridgeAfterQuiz.scrollIntoViewIfNeeded();
    const href = await firstBridgeAfterQuiz.getAttribute('href');
    expect(href).toBe('#objections');
});

test('bridge после Objections ведёт к #booking', async ({page}) => {
    await page.goto('/#objections');
    const bridgeLink = page.locator('a[href="#booking"]').first();
    await bridgeLink.scrollIntoViewIfNeeded();
    await expect(bridgeLink).toBeVisible();
    await bridgeLink.click();
    await expect(page.locator('#booking')).toBeInViewport();
});

import {test, expect} from '@playwright/test';

test('6 чипов в .slot-grid', async ({page}) => {
    await page.goto('/#booking');
    await expect(page.locator('#booking .slot-chip')).toHaveCount(6);
});

test('нет чипа Сб/Суббота', async ({page}) => {
    await page.goto('/#booking');
    const text = (await page.locator('#booking .slot-grid').textContent()) ?? '';
    expect(text).not.toMatch(/Сб|суббот/i);
});

test('клик чипа: CTA-href содержит выбранное время encoded', async ({page}) => {
    await page.goto('/#booking');
    const chip = page.locator('#booking .slot-chip').nth(2); // Среда 08:00
    await chip.click();
    const href = await page.locator('[data-testid="booking-cta"]').getAttribute('href');
    expect(decodeURIComponent(href ?? '')).toContain('Среда');
    expect(decodeURIComponent(href ?? '')).toContain('08:00');
});
import {test, expect} from '@playwright/test';

test('4 .tr-step и 4-й заголовок — Рабочее тело', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('#bab .tr-step')).toHaveCount(4);
    const titles = await page.locator('#bab .tr-step h3').allTextContents();
    expect(titles[3]?.trim()).toBe('Рабочее тело');
});

test('.tr-line присутствует в DOM', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('#bab .tr-line')).toBeAttached();
});
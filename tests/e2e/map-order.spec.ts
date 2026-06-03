import {test, expect} from '@playwright/test';

test('4 ЖК в исходном порядке Золотая Гавань → Три ветра → Life-Приморский → Стокгольм', async ({page}) => {
    await page.goto('/');
    const names = await page.locator('#map .zk .name').allTextContents();
    expect(names.map((s) => s.trim())).toEqual(['Золотая Гавань', 'Три ветра', 'Life-Приморский', 'Стокгольм']);
});

test('4 пина в .map-box', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('#map .map-box .pin')).toHaveCount(4);
});

test('подпись под картой видна', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('#map .loc-cap')).toBeVisible();
});
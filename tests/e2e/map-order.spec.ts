import {test, expect} from '@playwright/test';

test('4 ЖК в порядке Life-Приморский → Стокгольм → Три ветра → Золотая Гавань (по близости)', async ({page}) => {
    await page.goto('/');
    const names = await page.locator('#map .zk .name').allTextContents();
    expect(names.map((s) => s.trim())).toEqual(['Life-Приморский', 'Стокгольм', 'Три ветра', 'Золотая Гавань']);
});

test('4 пина в .map-box', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('#map .map-box .pin')).toHaveCount(4);
});

test('подпись под картой видна', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('#map .loc-cap')).toBeVisible();
});
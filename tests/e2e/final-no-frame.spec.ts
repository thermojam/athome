import {test, expect} from '@playwright/test';

test('#final не имеет класса .card (закон рамок §5.8)', async ({page}) => {
    await page.goto('/#final');
    const hasCardClass = await page.locator('#final').evaluate((el) => el.classList.contains('card'));
    expect(hasCardClass).toBe(false);
    await expect(page.locator('#final > .card, #final > * > .card').first()).toHaveCount(0);
});
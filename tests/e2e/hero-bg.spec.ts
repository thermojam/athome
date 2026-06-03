import {test, expect} from '@playwright/test';

test('hero-grid и hero-glow присутствуют', async ({page}) => {
    await page.goto('/');
    await expect(page.locator('.hero-grid')).toBeAttached();
    await expect(page.locator('.hero-glow')).toBeAttached();
});

test('pointermove на hero меняет CSS-vars --mx/--my в .hero-glow (desktop)', async ({page}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-desktop', 'pointermove glow только на десктопе');
    await page.goto('/');
    const hero = page.locator('#hero');
    const glow = page.locator('.hero-glow');
    await hero.hover({position: {x: 200, y: 200}});
    const mxBefore = await glow.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--mx'));
    await hero.hover({position: {x: 600, y: 300}});
    const mxAfter = await glow.evaluate((el) => (el as HTMLElement).style.getPropertyValue('--mx'));
    expect(mxBefore).not.toBe(mxAfter);
});
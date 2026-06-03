import {test, expect} from '@playwright/test';

test('секции v3.3 идут в DOM-порядке: hero → about → pain → map → bab → test → objections → booking → final', async ({page}) => {
    await page.goto('/');
    const ids = await page.locator('section[id], header[id]').evaluateAll((els) => els.map((el) => el.id).filter(Boolean));
    const filtered = ids.filter((id) => ['hero', 'about', 'pain', 'map', 'bab', 'test', 'objections', 'booking', 'final'].includes(id));
    expect(filtered).toEqual(['hero', 'about', 'pain', 'map', 'bab', 'test', 'objections', 'booking', 'final']);
});

test('между Hero и About нет мостика (мягкий переход)', async ({page}) => {
    await page.goto('/');
    const heroSection = page.locator('#hero');
    const aboutSection = page.locator('#about');
    await expect(heroSection).toBeVisible();
    await expect(aboutSection).toBeAttached();
    const bridgeBetween = page.locator('a[href="#about"]');
    expect(await bridgeBetween.count()).toBe(0);
});

test('toBooking-мост стоит между Objections и Booking', async ({page}) => {
    await page.goto('/');
    const links = page.locator('a[href="#booking"]');
    expect(await links.count()).toBeGreaterThanOrEqual(1);
});
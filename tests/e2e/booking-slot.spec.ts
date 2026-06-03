import {test, expect} from '@playwright/test';

test('BookingSlot v3.3: 6 chips, first pre-selected, CTA points to Telegram', async ({page}) => {
    await page.goto('/#booking');
    const chips = page.locator('#booking .slot-chip');
    await expect(chips).toHaveCount(6);
    await expect(chips.first()).toHaveAttribute('aria-pressed', 'true');
    const href = await page.locator('[data-testid="booking-cta"]').getAttribute('href');
    expect(href ?? '').toMatch(/^https:\/\/t\.me\//);
});

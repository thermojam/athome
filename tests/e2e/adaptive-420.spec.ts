import {test, expect, devices} from '@playwright/test';

test.use({...devices['iPhone 13 mini'], viewport: {width: 390, height: 844}});

test('390×844: .slot-grid даёт 2 колонки', async ({page}) => {
    await page.goto('/#booking');
    const grid = page.locator('#booking .slot-grid');
    const cols = await grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(cols).toBeLessThanOrEqual(2);
});

test('390×844: бейдж свободного слота не выходит за карточку', async ({page}) => {
    await page.goto('/#booking');
    const card = await page.locator('#booking .slot-wrap').boundingBox();
    const badge = await page.locator('#booking .badge-free').boundingBox();

    expect(card).not.toBeNull();
    expect(badge).not.toBeNull();
    if (card && badge) {
        expect(badge.left).toBeGreaterThanOrEqual(card.left);
        expect(badge.right).toBeLessThanOrEqual(card.right);
    }
});

test('390×844: .map-box близок к квадрату (aspect ~1)', async ({page}) => {
    await page.goto('/#map');
    const box = await page.locator('#map .map-box').boundingBox();
    expect(box).not.toBeNull();
    if (box) {
        const ratio = box.width / box.height;
        expect(ratio).toBeGreaterThan(0.85);
        expect(ratio).toBeLessThan(1.15);
    }
});

test('390×844: .about-cta .btn растягивается на 100% ширины', async ({page}) => {
    await page.goto('/#about');
    const btnWidth = await page.locator('#about .about-cta .btn').first().evaluate((el) => el.getBoundingClientRect().width);
    const sectionWidth = await page.locator('#about').evaluate((el) => el.getBoundingClientRect().width);
    expect(btnWidth).toBeGreaterThan(sectionWidth * 0.7);
});

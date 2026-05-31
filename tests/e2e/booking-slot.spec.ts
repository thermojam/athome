import {test, expect} from '@playwright/test';

test.describe('BookingSlot e2e (SPEC §9, §15)', () => {
    test('выбор чипа → href ссылки содержит время; клик ведёт на t.me/...', async ({page}) => {
        await page.goto('/');
        await page.locator('#booking').scrollIntoViewIfNeeded();

        // CTA disabled до выбора
        const cta = page.getByTestId('booking-cta');
        await expect(cta).toHaveAttribute('aria-disabled', 'true');

        // Выбираем первый чип
        const firstChip = page.locator('#booking button[aria-pressed]').first();
        const chipText = (await firstChip.innerText()).toLowerCase();
        await firstChip.click();
        await expect(firstChip).toHaveAttribute('aria-pressed', 'true');

        // CTA стал ссылкой <a> на t.me/
        await expect(cta).toHaveAttribute('href', /^https:\/\/t\.me\//);
        const href = await cta.getAttribute('href');
        expect(href).toBeTruthy();

        // В URL должен быть encoded день недели или время из чипа
        const decoded = decodeURIComponent(href!);
        const timeMatch = chipText.match(/\d{2}:\d{2}/);
        expect(timeMatch).not.toBeNull();
        expect(decoded).toContain(timeMatch![0]);
    });

    test('подпись честности видна; нет «забронировано»/«занято» в DOM', async ({page}) => {
        await page.goto('/');
        await expect(page.getByText(/откроется telegram/i)).toBeVisible();

        // Кликаем чип + CTA — никаких слов про бронь не должно появиться
        const firstChip = page.locator('#booking button[aria-pressed]').first();
        await firstChip.click();
        await page.getByTestId('booking-cta').click({modifiers: ['Meta'], force: true}).catch(() => {
            // На некоторых платформах ссылка открывается в новой вкладке —
            // нам важно только что DOM на основной странице не показал «забронировано».
        });

        const body = await page.locator('body').innerText();
        const lower = body.toLowerCase();
        for (const word of ['забронирован', 'занято', 'зарезервирован', 'ваш слот', 'место за вами']) {
            expect(lower).not.toContain(word);
        }
    });
});

import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BookingSlot} from '@/components/sections/BookingSlot';
import {SLOTS} from '@/lib/slots-data';

describe('BookingSlot (SPEC §9)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'test_user');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
        delete window.ym;
    });

    it('рендерит все слоты как кнопки с aria-pressed="false"', () => {
        render(<BookingSlot/>);
        const chips = screen.getAllByRole('button', {name: /\d{2}:\d{2}/});
        expect(chips).toHaveLength(SLOTS.length);
        for (const c of chips) {
            expect(c).toHaveAttribute('aria-pressed', 'false');
        }
    });

    it('CTA «Занять слот» disabled пока ничего не выбрано', () => {
        render(<BookingSlot/>);
        const cta = screen.getByTestId('booking-cta');
        expect(cta).toHaveAttribute('aria-disabled', 'true');
    });

    it('подпись честности про Telegram всегда видна', () => {
        render(<BookingSlot/>);
        expect(screen.getByText(/откроется telegram/i)).toBeInTheDocument();
    });

    it('выбор чипа: aria-pressed становится "true", CTA становится включённым', async () => {
        const user = userEvent.setup();
        render(<BookingSlot/>);
        const chip = screen.getAllByRole('button', {name: /\d{2}:\d{2}/})[0];
        await user.click(chip);
        expect(chip).toHaveAttribute('aria-pressed', 'true');
        const cta = screen.getByTestId('booking-cta');
        expect(cta).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('выбор чипа: href ссылки CTA содержит выбранный день и время (encoded)', async () => {
        const user = userEvent.setup();
        render(<BookingSlot/>);
        const target = SLOTS[1];
        const chip = screen.getByRole('button', {name: new RegExp(target.time)});
        await user.click(chip);
        const cta = screen.getByTestId('booking-cta') as HTMLAnchorElement;
        expect(cta.href).toContain('t.me/test_user');
        expect(decodeURIComponent(cta.href)).toContain(target.day);
        expect(decodeURIComponent(cta.href)).toContain(target.time);
    });

    it('выбор чипа шлёт reachGoal("slot_select")', async () => {
        const ym = vi.fn();
        window.ym = ym;
        const user = userEvent.setup();
        render(<BookingSlot/>);
        await user.click(screen.getAllByRole('button', {name: /\d{2}:\d{2}/})[0]);
        const calls = ym.mock.calls.filter((c) => c[2] === 'slot_select');
        expect(calls).toHaveLength(1);
    });

    it('клик по активному CTA шлёт reachGoal("slot_take")', async () => {
        const ym = vi.fn();
        window.ym = ym;
        const user = userEvent.setup();
        render(<BookingSlot/>);
        await user.click(screen.getAllByRole('button', {name: /\d{2}:\d{2}/})[0]);
        await user.click(screen.getByTestId('booking-cta'));
        const calls = ym.mock.calls.filter((c) => c[2] === 'slot_take');
        expect(calls).toHaveLength(1);
    });

    it('честность: после клика «Занять» в DOM нет слов забронировано/занято/зарезервировано', async () => {
        const user = userEvent.setup();
        render(<BookingSlot/>);
        await user.click(screen.getAllByRole('button', {name: /\d{2}:\d{2}/})[0]);
        await user.click(screen.getByTestId('booking-cta'));
        const html = document.body.innerHTML.toLowerCase();
        for (const word of ['забронирован', 'занято', 'зарезервирован', 'ваш слот', 'место за вами']) {
            expect(html).not.toContain(word);
        }
    });

    it('выбор второго чипа: первый снова aria-pressed="false"', async () => {
        const user = userEvent.setup();
        render(<BookingSlot/>);
        const chips = screen.getAllByRole('button', {name: /\d{2}:\d{2}/});
        await user.click(chips[0]);
        await user.click(chips[1]);
        expect(chips[0]).toHaveAttribute('aria-pressed', 'false');
        expect(chips[1]).toHaveAttribute('aria-pressed', 'true');
    });

    it('секция имеет id="booking" (якорь для bridge)', () => {
        const {container} = render(<BookingSlot/>);
        expect(container.querySelector('#booking')).not.toBeNull();
    });
});

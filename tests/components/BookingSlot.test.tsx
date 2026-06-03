import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BookingSlot} from '@/components/sections/BookingSlot';
import {SLOTS} from '@/lib/slots-data';

describe('BookingSlot (SPEC v3.3 §9)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'test_user');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
        delete window.ym;
    });

    it('секция id="booking"', () => {
        const {container} = render(<BookingSlot/>);
        expect(container.querySelector('#booking')).not.toBeNull();
    });

    it('рендерит ровно 6 чипов (v3.3 — 6 дней без субботы)', () => {
        render(<BookingSlot/>);
        const chips = screen.getAllByRole('button', {name: /\d{2}:\d{2}/});
        expect(chips).toHaveLength(6);
        expect(chips).toHaveLength(SLOTS.length);
    });

    it('подпись честности про Telegram видна', () => {
        render(<BookingSlot/>);
        expect(screen.getByText(/откроется telegram/i)).toBeInTheDocument();
    });

    it('первый чип pre-selected (aria-pressed="true"); CTA активна с момента рендера', () => {
        render(<BookingSlot/>);
        const chips = screen.getAllByRole('button', {name: /\d{2}:\d{2}/});
        expect(chips[0]).toHaveAttribute('aria-pressed', 'true');
        const cta = screen.getByTestId('booking-cta');
        expect(cta).not.toHaveAttribute('aria-disabled', 'true');
    });

    it('у компонента нет .slot-tags / .s-tag (v3.3 — теги hint/walk убраны)', () => {
        const {container} = render(<BookingSlot/>);
        expect(container.querySelector('.slot-tags')).toBeNull();
        expect(container.querySelector('.s-tag')).toBeNull();
    });

    it('клик по другому чипу: aria-pressed переключается, href содержит выбранный день/время', async () => {
        const user = userEvent.setup();
        render(<BookingSlot/>);
        const chips = screen.getAllByRole('button', {name: /\d{2}:\d{2}/});
        const target = SLOTS[2];
        await user.click(chips[2]);
        expect(chips[0]).toHaveAttribute('aria-pressed', 'false');
        expect(chips[2]).toHaveAttribute('aria-pressed', 'true');
        const cta = screen.getByTestId('booking-cta') as HTMLAnchorElement;
        expect(decodeURIComponent(cta.href)).toContain(target.day);
        expect(decodeURIComponent(cta.href)).toContain(target.time);
    });

    it('выбор чипа шлёт reachGoal("slot_select")', async () => {
        const ym = vi.fn();
        window.ym = ym;
        const user = userEvent.setup();
        render(<BookingSlot/>);
        await user.click(screen.getAllByRole('button', {name: /\d{2}:\d{2}/})[1]);
        const calls = ym.mock.calls.filter((c) => c[2] === 'slot_select');
        expect(calls).toHaveLength(1);
    });

    it('клик по CTA шлёт reachGoal("slot_take")', async () => {
        const ym = vi.fn();
        window.ym = ym;
        const user = userEvent.setup();
        render(<BookingSlot/>);
        await user.click(screen.getByTestId('booking-cta'));
        const calls = ym.mock.calls.filter((c) => c[2] === 'slot_take');
        expect(calls).toHaveLength(1);
    });

    it('честность: в DOM нет слов забронировано/занято/зарезервирован', async () => {
        const user = userEvent.setup();
        render(<BookingSlot/>);
        await user.click(screen.getByTestId('booking-cta'));
        const html = document.body.innerHTML.toLowerCase();
        for (const word of ['забронирован', 'занято', 'зарезервирован', 'место за вами']) {
            expect(html).not.toContain(word);
        }
    });

    it('кнопка .btn-take имеет класс btn-take (центрирование margin auto)', () => {
        render(<BookingSlot/>);
        expect(screen.getByTestId('booking-cta').classList.contains('btn-take')).toBe(true);
    });
});
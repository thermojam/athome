import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {FinalCta} from '@/components/sections/FinalCta';
import {CONTENT} from '@/lib/quiz-data';

describe('FinalCta (SPEC v3.3)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'test_user');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('секция id="final" и НЕ имеет класса .card (закон рамок)', () => {
        const {container} = render(<FinalCta/>);
        const section = container.querySelector('#final');
        expect(section).not.toBeNull();
        expect(section?.classList.contains('card')).toBe(false);
        expect(section?.querySelector('.card')).toBeNull();
    });

    it('содержит kicker первый шаг (case-insensitive)', () => {
        render(<FinalCta/>);
        const kicker = screen.getByText(new RegExp(CONTENT.finalCta.kicker, 'i'));
        expect(kicker).toBeInTheDocument();
    });

    it('primary CTA → #test', () => {
        render(<FinalCta/>);
        const cta = screen.getByRole('link', {name: new RegExp(CONTENT.finalCta.cta1.replace(/[^а-яА-ЯёЁ]+/g, '.*'))});
        expect(cta.getAttribute('href')).toBe('#test');
    });

    it('secondary CTA — Telegram-deeplink', () => {
        render(<FinalCta/>);
        const cta = screen.getByRole('link', {name: /Сразу написать/});
        expect(cta.getAttribute('href')).toMatch(/^https:\/\/t\.me\//);
    });
});
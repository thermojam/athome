import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Hero} from '@/components/sections/Hero';
import {CONTENT} from '@/lib/quiz-data';

describe('Hero (SPEC v3.3)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'test_user');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('ровно один <h1>', () => {
        render(<Hero/>);
        expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1);
    });

    it('cyan-акцент обёрнут в <span class="accent"> со строкой h1Accent', () => {
        const {container} = render(<Hero/>);
        const accent = container.querySelector('h1 .accent');
        expect(accent?.textContent?.trim()).toBe(CONTENT.hero.h1Accent);
    });

    it('пилюли v3.3 убраны — нет <ul> внутри секции', () => {
        const {container} = render(<Hero/>);
        const hero = container.querySelector('#hero');
        expect(hero?.querySelectorAll('ul').length ?? 0).toBe(0);
    });

    it('primary CTA ведёт на #test', () => {
        render(<Hero/>);
        const cta = screen.getByRole('link', {name: new RegExp(CONTENT.hero.cta.replace(/[^а-яА-ЯёЁ]+/g, '.*'))});
        expect(cta.getAttribute('href')).toBe('#test');
    });

    it('вторичная CTA ведёт на #booking (НЕ TG-deeplink)', () => {
        render(<Hero/>);
        const ctaSec = screen.getByRole('link', {name: CONTENT.hero.ctaSecondary});
        expect(ctaSec.getAttribute('href')).toBe('#booking');
    });

    it('содержит .hero-grid и .hero-glow (фон v3.3 §5.9)', () => {
        const {container} = render(<Hero/>);
        expect(container.querySelector('.hero-grid')).not.toBeNull();
        expect(container.querySelector('.hero-glow')).not.toBeNull();
    });

    it('секция имеет класс .hero (для CSS-фона и padding)', () => {
        const {container} = render(<Hero/>);
        expect(container.querySelector('section#hero')?.classList.contains('hero')).toBe(true);
    });
});

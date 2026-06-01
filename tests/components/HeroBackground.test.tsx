import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {render} from '@testing-library/react';
import {HeroBackground} from '@/components/sections/HeroBackground';

describe('HeroBackground (SPEC v3.3 §5.9)', () => {
    let originalMatchMedia: typeof window.matchMedia;

    beforeEach(() => {
        originalMatchMedia = window.matchMedia;
    });
    afterEach(() => {
        window.matchMedia = originalMatchMedia;
    });

    it('рендерит два div: .hero-grid и .hero-glow', () => {
        window.matchMedia = vi.fn().mockReturnValue({matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn()}) as never;
        const {container} = render(<HeroBackground/>);
        expect(container.querySelector('.hero-grid')).not.toBeNull();
        expect(container.querySelector('.hero-glow')).not.toBeNull();
    });

    it('начальные значения CSS-vars --mx/--my заданы в style', () => {
        window.matchMedia = vi.fn().mockReturnValue({matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn()}) as never;
        const {container} = render(<HeroBackground/>);
        const glow = container.querySelector('.hero-glow') as HTMLElement;
        expect(glow.style.getPropertyValue('--mx')).toBe('50%');
        expect(glow.style.getPropertyValue('--my')).toBe('50%');
    });
});

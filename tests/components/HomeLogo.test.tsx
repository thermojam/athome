import {describe, expect, it, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import Home from '@/app/page';

describe('Home logo placement', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'test_user');
        vi.stubGlobal(
            'IntersectionObserver',
            class {
                observe() {}
                disconnect() {}
            },
        );
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.unstubAllGlobals();
    });

    it('uses logo.svg in the hero top-left corner and in the footer', () => {
        const {container} = render(<Home/>);

        const heroLogo = container.querySelector('#hero img[alt="Логотип НК"]');
        const footerLogo = container.querySelector('footer img[alt="Логотип НК"]');
        expect(heroLogo?.getAttribute('src')).toBe('/logo.svg');
        expect(footerLogo?.getAttribute('src')).toBe('/logo.svg');

        const heroLogoWrap = heroLogo?.parentElement;
        expect(heroLogoWrap).toHaveClass('absolute', 'left-0', 'right-0', 'top-3', 'max-w-[var(--container)]', 'px-4');
    });
});

import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync('app/globals.css', 'utf8');

function rule(selector: string, source = css) {
    const start = source.indexOf(selector);
    expect(start).toBeGreaterThanOrEqual(0);
    const end = source.indexOf('}', start);
    return source.slice(start, end);
}

function mediaBlock(media: string, selector: string) {
    const mediaStart = css.indexOf(media);
    expect(mediaStart).toBeGreaterThanOrEqual(0);
    let searchFrom = mediaStart;

    while (searchFrom >= 0) {
        const blockStart = css.indexOf('{', searchFrom);
        let depth = 0;

        for (let index = blockStart; index < css.length; index++) {
            if (css[index] === '{') depth++;
            if (css[index] === '}') depth--;
            if (depth === 0) {
                const block = css.slice(blockStart + 1, index);
                if (block.includes(selector)) return block;
                break;
            }
        }

        searchFrom = css.indexOf(media, searchFrom + media.length);
    }

    throw new Error(`Missing media block: ${media} for ${selector}`);
}

describe('cookie consent responsive CSS', () => {
    it('uses the approved fixed deep-clear-glass surface', () => {
        const banner = rule('.cookie-consent-banner');

        expect(banner).toContain('position: fixed');
        expect(banner).toContain('inset: auto 0 0');
        expect(banner).toContain('z-index: 50');
        expect(banner).toContain('border-radius: 28px 28px 0 0');
        expect(banner).toContain('background-color: rgba(7, 11, 19, 0.22)');
        expect(banner).toContain('backdrop-filter: blur(7px) saturate(1.25) contrast(1.04)');
    });

    it('uses a horizontal desktop layout with equal action columns', () => {
        expect(rule('.cookie-consent-inner')).toContain('display: flex');
        expect(rule('.cookie-consent-inner')).toContain('align-items: center');
        expect(rule('.cookie-consent-actions')).toContain('grid-template-columns: repeat(2, minmax(0, 1fr))');
    });

    it('uses a vertical mobile layout with CTA reveal space and safe-area padding', () => {
        const mobile = mediaBlock('@media (max-width: 767px)', '.cookie-consent-inner');

        expect(rule('.cookie-consent-inner', mobile)).toContain('flex-direction: column');
        expect(rule('.cookie-consent-inner', mobile)).toContain('padding: 18px 16px calc(58px + env(safe-area-inset-bottom, 0px))');
        expect(rule('.cookie-consent-banner', mobile)).toContain('border-radius: 26px 26px 0 0');
    });

    it('removes obsolete consent layers and respects reduced motion', () => {
        const reducedMotion = mediaBlock('@media (prefers-reduced-motion: reduce)', '.cookie-consent-banner');

        expect(css).not.toContain('.cookie-consent-capsule');
        expect(css).not.toContain('.cookie-consent-dialog');
        expect(css).not.toContain('.cookie-consent-panel');
        expect(css).not.toContain('.cookie-consent-close');
        expect(rule('.cookie-consent-banner', reducedMotion)).toContain('animation: none');
    });
});

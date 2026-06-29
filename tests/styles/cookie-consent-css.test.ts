import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync('app/globals.css', 'utf8');

function rule(selector: string, source = css) {
    const start = source.indexOf(selector);
    expect(start).toBeGreaterThanOrEqual(0);
    const end = source.indexOf('}', start);
    return source.slice(start, end);
}

function mediaBlock(media: string, selector?: string) {
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
                if (!selector || block.includes(selector)) return block;
                break;
            }
        }

        searchFrom = css.indexOf(media, searchFrom + media.length);
    }

    throw new Error(`Missing media block: ${media}${selector ? ` for ${selector}` : ''}`);
}

describe('cookie consent responsive CSS', () => {
    it('keeps the passive capsule in the top safe area', () => {
        const capsule = rule('.cookie-consent-capsule');

        expect(capsule).toContain('position: fixed');
        expect(capsule).toContain('top: calc(env(safe-area-inset-top, 0px) + 12px)');
        expect(capsule).toContain('right: 12px');
        expect(capsule).not.toContain('bottom:');
    });

    it('uses a modal backdrop and a mobile bottom sheet', () => {
        const mobile = mediaBlock('@media (max-width: 560px)', '.cookie-consent-dialog');

        expect(rule('.cookie-consent-dialog::backdrop')).toContain('backdrop-filter: blur(6px)');
        expect(rule('.cookie-consent-dialog', mobile)).toContain('inset: auto 0 0');
        expect(rule('.cookie-consent-panel', mobile)).toContain('env(safe-area-inset-bottom, 0px)');
    });
});

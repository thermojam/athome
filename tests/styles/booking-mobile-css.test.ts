import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync('app/globals.css', 'utf8');

function mediaRule(media: string, selector: string) {
    const mediaStart = css.indexOf(media);
    expect(mediaStart).toBeGreaterThanOrEqual(0);

    const blockStart = css.indexOf('{', mediaStart);
    expect(blockStart).toBeGreaterThanOrEqual(0);

    let depth = 0;
    let blockEnd = -1;
    for (let i = blockStart; i < css.length; i++) {
        if (css[i] === '{') {
            depth++;
        }
        if (css[i] === '}') {
            depth--;
            if (depth === 0) {
                blockEnd = i;
                break;
            }
        }
    }
    expect(blockEnd).toBeGreaterThan(blockStart);

    const block = css.slice(blockStart + 1, blockEnd);
    const ruleStart = block.indexOf(selector);
    expect(ruleStart).toBeGreaterThanOrEqual(0);

    const ruleEnd = block.indexOf('}', ruleStart);
    return block.slice(ruleStart, ruleEnd);
}

function max560Rule(selector: string) {
    return mediaRule('@media (max-width: 560px)', selector);
}

describe('BookingSlot mobile CSS', () => {
    it('keeps the free badge inside the slot card on narrow screens', () => {
        expect(max560Rule('.slot-top')).toContain('flex-wrap: wrap');
        expect(max560Rule('.badge-free')).toContain('max-width: 100%');
    });

    it('shrinks the free badge before the 433px overflow range', () => {
        const rule = max560Rule('.badge-free');
        expect(rule).toContain('font-size: 10px');
        expect(rule).toContain('letter-spacing: 1px');
        expect(rule).toContain('padding: 6px 10px');
    });
});

describe('Mobile cosmetic CSS', () => {
    it('stretches about CTA buttons across the mobile content column', () => {
        const rowRule = mediaRule('@media (max-width: 820px)', '.about-cta');
        const buttonRule = mediaRule('@media (max-width: 820px)', '.about-cta .btn');
        expect(rowRule).toContain('flex-direction: column');
        expect(rowRule).toContain('align-items: stretch');
        expect(buttonRule).toContain('width: 100%');
    });

    it('uses a cyan accent border for bridge pills', () => {
        const ruleStart = css.indexOf('.bridge-pill');
        expect(ruleStart).toBeGreaterThanOrEqual(0);
        const ruleEnd = css.indexOf('}', ruleStart);
        const rule = css.slice(ruleStart, ruleEnd);
        const compact = (value: string) => value.replace(/\s+/g, '');
        const compactRule = compact(rule);
        expect(compactRule).toContain(compact('color: var(--color-cyan)'));
        expect(compactRule).toContain(
            compact('background: rgba(44, 230, 255, 0.08)'),
        );
        expect(compactRule).toContain(
            compact('border-color: rgba(44, 230, 255, 0.62)'),
        );
        expect(compactRule).toContain(
            compact('0 0 0 1px rgba(44, 230, 255, 0.55)'),
        );
        expect(compactRule).toContain(
            compact('0 0 24px rgba(44, 230, 255, 0.28)'),
        );
    });
});

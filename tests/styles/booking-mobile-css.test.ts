import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync('app/globals.css', 'utf8');

function max420Rule(selector: string) {
    const mediaStart = css.indexOf('@media (max-width: 420px)');
    expect(mediaStart).toBeGreaterThanOrEqual(0);

    const ruleStart = css.indexOf(selector, mediaStart);
    expect(ruleStart).toBeGreaterThanOrEqual(0);

    const ruleEnd = css.indexOf('}', ruleStart);
    return css.slice(ruleStart, ruleEnd);
}

describe('BookingSlot mobile CSS', () => {
    it('keeps the free badge inside the slot card on narrow screens', () => {
        expect(max420Rule('.slot-top')).toContain('flex-wrap: wrap');
        expect(max420Rule('.badge-free')).toContain('max-width: 100%');
    });
});

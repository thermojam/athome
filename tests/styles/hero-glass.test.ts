import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';

const css = readFileSync('app/globals.css', 'utf8');

describe('Hero glass CTA CSS', () => {
    it('blurs the animated grid behind the appointment button', () => {
        const start = css.indexOf('.hero .btn-secondary');
        expect(start).toBeGreaterThanOrEqual(0);
        const end = css.indexOf('}', start);
        const rule = css.slice(start, end);

        expect(rule).toContain('backdrop-filter: blur(var(--blur-md))');
        expect(rule).toContain('-webkit-backdrop-filter: blur(var(--blur-md))');
        expect(rule).not.toMatch(/(^|\s)filter:\s*blur/);
    });
});

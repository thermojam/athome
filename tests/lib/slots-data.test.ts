import {describe, it, expect} from 'vitest';
import {SLOTS} from '@/lib/slots-data';

describe('SLOTS data (SPEC §9.4)', () => {
    it('все слоты со status === "free" (busy на MVP не возим в DOM)', () => {
        for (const s of SLOTS) {
            expect(s.status).toBe('free');
        }
    });

    it('все id уникальны', () => {
        const ids = SLOTS.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it('у каждого слота непустые day/time/label', () => {
        for (const s of SLOTS) {
            expect(s.day).toBeTruthy();
            expect(s.time).toBeTruthy();
            expect(s.label).toBeTruthy();
        }
    });

    it('массив непустой (минимум один слот, иначе секция бесполезна)', () => {
        expect(SLOTS.length).toBeGreaterThan(0);
    });
});

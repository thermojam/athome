import {describe, it, expect} from 'vitest';
import {SLOTS} from '@/lib/slots-data';

describe('SLOTS data (SPEC §9.4, v3.3)', () => {
    it('содержит ровно 6 слотов (v3.3: 6 дней без субботы)', () => {
        expect(SLOTS).toHaveLength(6);
    });

    it('не содержит субботу (v3.3)', () => {
        for (const s of SLOTS) {
            expect(s.day.toLowerCase()).not.toContain('суббот');
        }
    });

    it('дни идут в порядке Пн → Вт → Ср → Чт → Пт → Вс', () => {
        const days = SLOTS.map((s) => s.day);
        expect(days).toEqual([
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Воскресенье',
        ]);
    });

    it('у элементов нет profileHint и walkMinutes (v3.3 — теги убраны)', () => {
        for (const s of SLOTS) {
            expect(s.profileHint).toBeUndefined();
            expect(s.walkMinutes).toBeUndefined();
        }
    });

    it('все слоты со status === "free"', () => {
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
});

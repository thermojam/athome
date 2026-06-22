import {describe, it, expect} from 'vitest';
import {createElement} from 'react';
import {render, screen} from '@testing-library/react';
import {Bridge} from '@/components/ui/Bridge';
import {BRIDGES} from '@/lib/quiz-data';

describe('BRIDGES (v3.3 §6 — порядок воронки)', () => {
    it('содержит все 6 мостиков v3.3', () => {
        expect(Object.keys(BRIDGES).sort()).toEqual(
            ['toBooking', 'toMap', 'toObjections', 'toProblem', 'toQuiz', 'toTransformation'].sort(),
        );
    });

    it('toBooking ведёт к #booking и появляется ПОСЛЕ Objections (v3.3 swap)', () => {
        expect(BRIDGES.toBooking.href).toBe('#booking');
        expect(BRIDGES.toBooking.question).toMatch(/выбер|время/i);
    });

    it('toObjections ведёт к #objections', () => {
        expect(BRIDGES.toObjections.href).toBe('#objections');
    });

    it('toTransformation cta — «смотреть путь» (v3.3, не «до / после»)', () => {
        expect(BRIDGES.toTransformation.cta.toLowerCase()).toContain('путь');
    });

    it('у каждого мостика есть question/cta/href', () => {
        for (const b of Object.values(BRIDGES)) {
            expect(b.question).toBeTruthy();
            expect(b.cta).toBeTruthy();
            expect(b.href).toMatch(/^#/);
            expect(b.cta).not.toMatch(/[→↓✈↺]/);
        }
    });

    it('кнопка мостика получает отдельный cyan accent class', () => {
        render(createElement(Bridge, {data: BRIDGES.toQuiz}));
        expect(screen.getByRole('link', {name: 'пройти разбор'})).toHaveClass('bridge-pill');
    });
});

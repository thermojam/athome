import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Problem} from '@/components/sections/Problem';

describe('Problem (SPEC v3.3 §5.5)', () => {
    it('секция id="pain"', () => {
        const {container} = render(<Problem/>);
        expect(container.querySelector('#pain')).not.toBeNull();
    });

    it('3 карточки в .pain-row', () => {
        const {container} = render(<Problem/>);
        const row = container.querySelector('[data-testid="pain-row"]');
        expect(row).not.toBeNull();
        const cards = row?.querySelectorAll('[data-testid="pain-card"]') ?? [];
        expect(cards.length).toBe(3);
    });

    it('title 3-й карточки = "Сил только на работу" (v3.3)', () => {
        render(<Problem/>);
        expect(screen.getByText('Сил только на работу')).toBeInTheDocument();
    });

    it('содержит 3 Lucide-иконки по ключам activity / trending-down / battery-low', () => {
        const {container} = render(<Problem/>);
        const expected = ['activity', 'trending-down', 'battery-low'];
        for (const key of expected) {
            const found = container.querySelector(`[data-icon="${key}"]`);
            expect(found, `icon ${key} expected`).not.toBeNull();
        }
    });
});
import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import {Transformation} from '@/components/sections/Transformation';

describe('Transformation (SPEC v3.3 §8.5)', () => {
    it('секция id="bab" и НЕ имеет класса .card (закон рамок)', () => {
        const {container} = render(<Transformation/>);
        const section = container.querySelector('#bab');
        expect(section).not.toBeNull();
        expect(section?.classList.contains('card')).toBe(false);
    });

    it('4 .tr-step с классами s1..s4 по порядку', () => {
        const {container} = render(<Transformation/>);
        const steps = container.querySelectorAll('.tr-step');
        expect(steps).toHaveLength(4);
        expect(steps[0].classList.contains('s1')).toBe(true);
        expect(steps[1].classList.contains('s2')).toBe(true);
        expect(steps[2].classList.contains('s3')).toBe(true);
        expect(steps[3].classList.contains('s4')).toBe(true);
    });

    it('weeks в порядке сейчас / недели 1–2 / недели 3–6 / 2–3 месяца', () => {
        const {container} = render(<Transformation/>);
        const weeks = Array.from(container.querySelectorAll('.tr-week')).map((el) => el.textContent?.trim());
        expect(weeks).toEqual(['сейчас', 'недели 1–2', 'недели 3–6', '2–3 месяца']);
    });

    it('заголовок 4-го шага — Рабочее тело', () => {
        const {container} = render(<Transformation/>);
        const titles = Array.from(container.querySelectorAll('.tr-step h3')).map((el) => el.textContent?.trim());
        expect(titles[3]).toBe('Рабочее тело');
    });

    it('содержит .tr-line', () => {
        const {container} = render(<Transformation/>);
        expect(container.querySelector('.tr-line')).not.toBeNull();
    });
});
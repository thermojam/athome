import {describe, expect, it} from 'vitest';
import {BRIDGES, CONTENT} from '@/lib/quiz-data';

const decorativeMarks = /[→↓✈↺]/;

describe('button copy', () => {
    it('keeps CTA labels free of decorative icon characters', () => {
        const labels = [
            CONTENT.hero.cta,
            CONTENT.hero.ctaSecondary,
            CONTENT.about.cta1,
            CONTENT.about.cta2,
            CONTENT.quiz.restart,
            CONTENT.booking.ctaLabel,
            CONTENT.finalCta.cta1,
            CONTENT.finalCta.cta2,
            CONTENT.stickyCta,
            ...Object.values(BRIDGES).map((bridge) => bridge.cta),
        ];

        for (const label of labels) {
            expect(label).not.toMatch(decorativeMarks);
        }
    });
});

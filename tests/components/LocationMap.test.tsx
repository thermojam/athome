import {describe, it, expect} from 'vitest';
import {render} from '@testing-library/react';
import {LocationMap} from '@/components/sections/LocationMap';
import {CONTENT} from '@/lib/quiz-data';

describe('LocationMap (SPEC v3.3 §8)', () => {
    it('секция id="map" и НЕ имеет класса .card (закон рамок §5.8)', () => {
        const {container} = render(<LocationMap/>);
        const section = container.querySelector('#map');
        expect(section).not.toBeNull();
        expect(section?.classList.contains('card')).toBe(false);
    });

    it('4 строки .zk в .zk-list в порядке Золотая Гавань → Три ветра → Приморский life → Стокгольм', () => {
        const {container} = render(<LocationMap/>);
        const items = container.querySelectorAll('.zk');
        expect(items).toHaveLength(4);
        const names = Array.from(items).map((el) => el.querySelector('.name')?.textContent?.trim());
        expect(names).toEqual(['Золотая Гавань', 'Три ветра', 'Приморский life', 'Стокгольм']);
    });

    it('4 пина в .map-box', () => {
        const {container} = render(<LocationMap/>);
        const pins = container.querySelectorAll('.map-box .pin');
        expect(pins).toHaveLength(4);
    });

    it('подпись .loc-cap соответствует CONTENT.map.caption', () => {
        const {container} = render(<LocationMap/>);
        const cap = container.querySelector('.loc-cap');
        expect(cap?.textContent?.trim()).toBe(CONTENT.map.caption);
    });

    it('SVG карты содержит залив (path с rgba(40,90,140,...) fill)', () => {
        const {container} = render(<LocationMap/>);
        const svg = container.querySelector('.map-box svg');
        expect(svg).not.toBeNull();
        const paths = svg?.querySelectorAll('path') ?? [];
        const hasCoast = Array.from(paths).some((p) => (p.getAttribute('fill') ?? '').includes('40,90,140'));
        expect(hasCoast).toBe(true);
    });
});
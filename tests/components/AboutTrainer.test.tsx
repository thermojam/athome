import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {AboutTrainer} from '@/components/sections/AboutTrainer';
import {CONTENT} from '@/lib/quiz-data';

describe('AboutTrainer (SPEC §8.6)', () => {
    beforeEach(() => {
        vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
        vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'test_user');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('секция имеет id="about" и НЕ класс .card (закон рамок §5.8)', () => {
        const {container} = render(<AboutTrainer/>);
        const section = container.querySelector('#about');
        expect(section).not.toBeNull();
        expect(section?.classList.contains('card')).toBe(false);
    });

    it('рендерит H2 "Никита Каменский"', () => {
        render(<AboutTrainer/>);
        expect(screen.getByRole('heading', {level: 2, name: /Никита Каменский/})).toBeInTheDocument();
    });

    it('рендерит 3 факта с цифрой и текстом', () => {
        const {container} = render(<AboutTrainer/>);
        const facts = container.querySelectorAll('.about-fact');
        expect(facts).toHaveLength(3);
        for (const fact of facts) {
            expect(fact.querySelector('.num')?.textContent?.trim()).toBeTruthy();
            expect(fact.querySelector('.txt')?.textContent?.trim()).toBeTruthy();
        }
    });

    it('бейдж в углу фото видим', () => {
        render(<AboutTrainer/>);
        expect(screen.getByText(CONTENT.about.badge)).toBeInTheDocument();
    });

    it('первая CTA ведёт на #test', () => {
        render(<AboutTrainer/>);
        const cta1 = screen.getByRole('link', {name: CONTENT.about.cta1});
        expect(cta1.getAttribute('href')).toBe('#test');
    });

    it('вторая CTA — Telegram-deeplink', () => {
        render(<AboutTrainer/>);
        const cta2 = screen.getByRole('link', {name: CONTENT.about.cta2});
        expect(cta2.getAttribute('href')).toMatch(/^https:\/\/t\.me\//);
    });

    it('CTA labels не содержат декоративных иконок', () => {
        render(<AboutTrainer/>);
        expect(screen.getByRole('link', {name: 'Пройти разбор за 60 секунд'})).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Сразу написать'})).toBeInTheDocument();
    });

    it('микрокопи под кнопками виден', () => {
        render(<AboutTrainer/>);
        expect(screen.getByText(CONTENT.about.microcopy)).toBeInTheDocument();
    });

    it('фото-блок рендерится с <img> (alt из CONTENT, src из public/)', () => {
        const {container} = render(<AboutTrainer/>);
        const photo = container.querySelector('.about-photo');
        expect(photo).not.toBeNull();
        const img = photo?.querySelector('img');
        expect(img).not.toBeNull();
        expect(img?.getAttribute('alt')).toBe(CONTENT.about.photo.alt);
    });
});

import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CookieBanner} from '@/components/legal/CookieBanner';

describe('CookieBanner', () => {
    it('explains analytics consent and links to both policies', () => {
        render(<CookieBanner onAccept={vi.fn()} onDecline={vi.fn()}/>);

        expect(screen.getByRole('region', {name: 'Согласие на cookies'})).toBeInTheDocument();
        expect(screen.getByText(/Сайт использует Яндекс.Метрику и Вебвизор/)).toBeInTheDocument();
        expect(screen.getByText(/Аналитика включается только с вашего согласия/)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Политика cookies'})).toHaveAttribute('href', '/cookies/');
        expect(screen.getByRole('link', {name: 'Политика конфиденциальности'})).toHaveAttribute('href', '/privacy/');
    });

    it('calls accept exactly once', async () => {
        const user = userEvent.setup();
        const onAccept = vi.fn();
        render(<CookieBanner onAccept={onAccept} onDecline={vi.fn()}/>);

        await user.click(screen.getByRole('button', {name: 'Принять'}));

        expect(onAccept).toHaveBeenCalledTimes(1);
    });

    it('calls decline exactly once', async () => {
        const user = userEvent.setup();
        const onDecline = vi.fn();
        render(<CookieBanner onAccept={vi.fn()} onDecline={onDecline}/>);

        await user.click(screen.getByRole('button', {name: 'Отказаться'}));

        expect(onDecline).toHaveBeenCalledTimes(1);
    });
});

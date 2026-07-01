import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CookieBanner} from '@/components/legal/CookieBanner';

function renderBanner({
    onAccept = vi.fn(),
    onDecline = vi.fn(),
} = {}) {
    return {
        onAccept,
        onDecline,
        ...render(<CookieBanner onAccept={onAccept} onDecline={onDecline}/>),
    };
}

describe('CookieBanner', () => {
    it('renders the approved non-modal consent content', () => {
        const {container} = renderBanner();

        expect(screen.getByRole('region', {name: 'Cookies и аналитика'})).toBeInTheDocument();
        expect(screen.getByRole('heading', {name: 'Cookies и аналитика'})).toBeInTheDocument();
        expect(screen.getByText(/обезличенной статистики и улучшения страницы/)).toBeInTheDocument();
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Закрыть настройки cookies'})).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Cookies выключены · Настроить'})).not.toBeInTheDocument();
        expect(container.querySelector('.bg-violet')).not.toBeInTheDocument();
    });

    it('links to both legal policies', () => {
        renderBanner();

        expect(screen.getByRole('link', {name: 'Политика cookies'})).toHaveAttribute('href', '/cookies/');
        expect(screen.getByRole('link', {name: 'Политика конфиденциальности'})).toHaveAttribute('href', '/privacy/');
    });

    it('exposes equal first-layer decisions and calls each callback once', async () => {
        const user = userEvent.setup();
        const {onAccept, onDecline} = renderBanner();
        const accept = screen.getByRole('button', {name: 'Принять'});
        const decline = screen.getByRole('button', {name: 'Отказаться'});

        expect(accept).toHaveClass('btn-md', 'flex-1');
        expect(decline).toHaveClass('btn-md', 'flex-1');

        await user.click(accept);
        await user.click(decline);

        expect(onAccept).toHaveBeenCalledOnce();
        expect(onDecline).toHaveBeenCalledOnce();
    });
});

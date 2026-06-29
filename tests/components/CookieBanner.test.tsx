import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CookieBanner} from '@/components/legal/CookieBanner';

function renderBanner({
    open = false,
    onOpenChange = vi.fn(),
    onAccept = vi.fn(),
    onDecline = vi.fn(),
} = {}) {
    return {
        onOpenChange,
        onAccept,
        onDecline,
        ...render(
            <CookieBanner
                open={open}
                onOpenChange={onOpenChange}
                onAccept={onAccept}
                onDecline={onDecline}
            />,
        ),
    };
}

describe('CookieBanner', () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
            this.open = true;
        });
        HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
            this.open = false;
            this.dispatchEvent(new Event('close'));
        });
    });

    it('renders a closed privacy capsule by default', () => {
        renderBanner();

        expect(screen.getByRole('button', {name: 'Cookies выключены · Настроить'})).toBeInTheDocument();
        expect(screen.queryByRole('dialog', {name: 'Настройки cookies'})).not.toBeInTheDocument();
    });

    it('asks the controller to open settings from the capsule', async () => {
        const user = userEvent.setup();
        const {onOpenChange} = renderBanner();

        await user.click(screen.getByRole('button', {name: 'Cookies выключены · Настроить'}));

        expect(onOpenChange).toHaveBeenCalledOnce();
        expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('shows policies and equal first-layer decisions when open', () => {
        renderBanner({open: true});

        expect(screen.getByRole('dialog', {name: 'Настройки cookies'})).toBeInTheDocument();
        expect(screen.getByText(/Яндекс.Метрика и Вебвизор выключены/)).toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Политика cookies'})).toHaveAttribute('href', '/cookies/');
        expect(screen.getByRole('link', {name: 'Политика конфиденциальности'})).toHaveAttribute('href', '/privacy/');
        expect(screen.getByRole('button', {name: 'Отказаться'})).toHaveClass('btn-secondary');
        expect(screen.getByRole('button', {name: 'Принять'})).toHaveClass('btn-secondary');
    });

    it('calls each decision callback exactly once', async () => {
        const user = userEvent.setup();
        const {onAccept, onDecline} = renderBanner({open: true});

        await user.click(screen.getByRole('button', {name: 'Принять'}));
        await user.click(screen.getByRole('button', {name: 'Отказаться'}));

        expect(onAccept).toHaveBeenCalledOnce();
        expect(onDecline).toHaveBeenCalledOnce();
    });

    it('dismisses through close and Escape without making a decision', async () => {
        const user = userEvent.setup();
        const closeResult = renderBanner({open: true});

        await user.click(screen.getByRole('button', {name: 'Закрыть настройки cookies'}));

        expect(closeResult.onOpenChange).toHaveBeenCalledWith(false);
        expect(closeResult.onAccept).not.toHaveBeenCalled();
        expect(closeResult.onDecline).not.toHaveBeenCalled();

        closeResult.unmount();
        const escapeResult = renderBanner({open: true});
        screen.getByRole('dialog', {name: 'Настройки cookies'})
            .dispatchEvent(new Event('cancel', {bubbles: true, cancelable: true}));

        expect(escapeResult.onOpenChange).toHaveBeenCalledWith(false);
        expect(escapeResult.onAccept).not.toHaveBeenCalled();
        expect(escapeResult.onDecline).not.toHaveBeenCalled();
    });
});

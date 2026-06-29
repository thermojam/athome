import {beforeEach, describe, expect, it, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ConsentProvider, useConsent} from '@/components/analytics/ConsentProvider';
import {CONSENT_STORAGE_KEY, writeConsent} from '@/lib/consent';

vi.mock('@/components/analytics/YandexMetrika', () => ({
    YandexMetrika: () => <div data-testid="metrika"/>,
}));

function ConsentProbe() {
    const {decision, accept, decline, reopen} = useConsent();

    return (
        <div>
            <output>{decision === undefined ? 'loading' : decision ?? 'none'}</output>
            <button type="button" onClick={accept}>accept</button>
            <button type="button" onClick={decline}>decline</button>
            <button type="button" onClick={reopen}>reopen</button>
        </div>
    );
}

function renderProvider() {
    return render(
        <ConsentProvider>
            <ConsentProbe/>
        </ConsentProvider>,
    );
}

describe('ConsentProvider', () => {
    beforeEach(() => {
        localStorage.clear();
        HTMLDialogElement.prototype.showModal = function () {
            this.open = true;
        };
        HTMLDialogElement.prototype.close = function () {
            this.open = false;
            this.dispatchEvent(new Event('close'));
        };
    });

    it('hydrates with no decision, shows the capsule, and does not mount Metrika', async () => {
        renderProvider();

        await screen.findByText('none');
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(screen.getByRole('button', {name: 'Cookies выключены · Настроить'})).toBeInTheDocument();
        expect(screen.queryByRole('dialog', {name: 'Настройки cookies'})).not.toBeInTheDocument();
    });

    it('opens settings from the passive capsule', async () => {
        const user = userEvent.setup();
        renderProvider();
        await screen.findByText('none');

        await user.click(screen.getByRole('button', {name: 'Cookies выключены · Настроить'}));

        expect(screen.getByRole('dialog', {name: 'Настройки cookies'})).toBeInTheDocument();
    });

    it('hydrates accepted consent and mounts Metrika', async () => {
        writeConsent('accepted');
        renderProvider();

        await screen.findByText('accepted');
        expect(screen.getByTestId('metrika')).toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Cookies выключены · Настроить'})).not.toBeInTheDocument();
    });

    it('hydrates declined consent without mounting Metrika', async () => {
        writeConsent('declined');
        renderProvider();

        await screen.findByText('declined');
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(screen.queryByRole('button', {name: 'Cookies выключены · Настроить'})).not.toBeInTheDocument();
    });

    it('accepts consent, persists it, and mounts Metrika', async () => {
        const user = userEvent.setup();
        renderProvider();

        await user.click(screen.getByRole('button', {name: 'accept'}));

        expect(screen.getByText('accepted')).toBeInTheDocument();
        expect(screen.getByTestId('metrika')).toBeInTheDocument();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toContain('accepted');
    });

    it('declines consent, persists it, and keeps Metrika unmounted', async () => {
        const user = userEvent.setup();
        renderProvider();

        await user.click(screen.getByRole('button', {name: 'decline'}));

        expect(screen.getByText('declined')).toBeInTheDocument();
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toContain('declined');
    });

    it('reopens settings, clears the decision, and unmounts Metrika', async () => {
        const user = userEvent.setup();
        writeConsent('accepted');
        renderProvider();
        await screen.findByText('accepted');

        await user.click(screen.getByRole('button', {name: 'reopen'}));

        await waitFor(() => expect(screen.getByText('none')).toBeInTheDocument());
        expect(screen.getByRole('dialog', {name: 'Настройки cookies'})).toBeInTheDocument();
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    });
});

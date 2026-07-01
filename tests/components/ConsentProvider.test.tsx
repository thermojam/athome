import {beforeEach, describe, expect, it, vi} from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ConsentProvider, useConsent} from '@/components/analytics/ConsentProvider';
import {CONSENT_STORAGE_KEY, writeConsent} from '@/lib/consent';

vi.mock('@/components/analytics/YandexMetrika', () => ({
    YandexMetrika: () => <div data-testid="metrika"/>,
}));

const interactionEvents = [
    ['scroll', () => fireEvent.scroll(window)],
    ['touchstart', () => fireEvent.touchStart(window)],
    ['pointerdown', () => fireEvent.pointerDown(window)],
    ['keydown', () => fireEvent.keyDown(window, {key: 'Tab'})],
] as const;

function ConsentProbe() {
    const {decision, reopen} = useConsent();

    return (
        <div>
            <output>{decision === undefined ? 'loading' : decision ?? 'none'}</output>
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
        vi.restoreAllMocks();
    });

    it('hydrates unresolved consent without showing UI or mounting Metrika', async () => {
        renderProvider();

        await screen.findByText('none');
        expect(screen.queryByRole('region', {name: 'Cookies и аналитика'})).not.toBeInTheDocument();
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
    });

    it.each(interactionEvents)('reveals the banner after %s', async (_eventName, reveal) => {
        renderProvider();
        await screen.findByText('none');

        reveal();

        expect(await screen.findByRole('region', {name: 'Cookies и аналитика'})).toBeInTheDocument();
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
    });

    it('removes the remaining reveal listeners after the first interaction', async () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        renderProvider();
        await screen.findByText('none');

        fireEvent.scroll(window);

        expect(await screen.findByRole('region', {name: 'Cookies и аналитика'})).toBeInTheDocument();
        for (const [eventName] of interactionEvents) {
            expect(removeSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
        }

        fireEvent.keyDown(window, {key: 'Tab'});
        expect(screen.getAllByRole('region', {name: 'Cookies и аналитика'})).toHaveLength(1);
    });

    it('hydrates accepted consent, mounts Metrika, and ignores reveal events', async () => {
        writeConsent('accepted');
        renderProvider();

        await screen.findByText('accepted');
        fireEvent.scroll(window);

        expect(screen.getByTestId('metrika')).toBeInTheDocument();
        expect(screen.queryByRole('region', {name: 'Cookies и аналитика'})).not.toBeInTheDocument();
    });

    it('hydrates declined consent without Metrika and ignores reveal events', async () => {
        writeConsent('declined');
        renderProvider();

        await screen.findByText('declined');
        fireEvent.scroll(window);

        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(screen.queryByRole('region', {name: 'Cookies и аналитика'})).not.toBeInTheDocument();
    });

    it('accepts from the banner, persists the decision, and mounts Metrika', async () => {
        const user = userEvent.setup();
        renderProvider();
        await screen.findByText('none');
        fireEvent.scroll(window);

        await user.click(await screen.findByRole('button', {name: 'Принять'}));

        expect(screen.getByText('accepted')).toBeInTheDocument();
        expect(screen.getByTestId('metrika')).toBeInTheDocument();
        expect(screen.queryByRole('region', {name: 'Cookies и аналитика'})).not.toBeInTheDocument();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toContain('accepted');
    });

    it('declines from the banner, persists the decision, and keeps Metrika unmounted', async () => {
        const user = userEvent.setup();
        renderProvider();
        await screen.findByText('none');
        fireEvent.scroll(window);

        await user.click(await screen.findByRole('button', {name: 'Отказаться'}));

        expect(screen.getByText('declined')).toBeInTheDocument();
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(screen.queryByRole('region', {name: 'Cookies и аналитика'})).not.toBeInTheDocument();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toContain('declined');
    });

    it('reopens immediately, clears the decision, and unmounts Metrika', async () => {
        const user = userEvent.setup();
        writeConsent('accepted');
        renderProvider();
        await screen.findByText('accepted');

        await user.click(screen.getByRole('button', {name: 'reopen'}));

        await waitFor(() => expect(screen.getByText('none')).toBeInTheDocument());
        expect(screen.getByRole('region', {name: 'Cookies и аналитика'})).toBeInTheDocument();
        expect(screen.queryByTestId('metrika')).not.toBeInTheDocument();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    });
});

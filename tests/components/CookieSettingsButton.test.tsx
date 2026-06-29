import {describe, expect, it, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {CookieSettingsButton} from '@/components/legal/CookieSettingsButton';

const {reopen} = vi.hoisted(() => ({reopen: vi.fn()}));

vi.mock('@/components/analytics/ConsentProvider', () => ({
    useConsent: () => ({reopen}),
}));

describe('CookieSettingsButton', () => {
    it('reopens cookie settings', async () => {
        const user = userEvent.setup();
        render(<CookieSettingsButton/>);

        await user.click(screen.getByRole('button', {name: 'Настройки cookies'}));

        expect(reopen).toHaveBeenCalledTimes(1);
    });
});

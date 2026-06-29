'use client';

import {useConsent} from '@/components/analytics/ConsentProvider';

export function CookieSettingsButton(): React.ReactNode {
    const {reopen} = useConsent();

    return (
        <button type="button" className="underline hover:text-tx2" onClick={reopen}>
            Настройки cookies
        </button>
    );
}

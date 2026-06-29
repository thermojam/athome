'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {YandexMetrika} from '@/components/analytics/YandexMetrika';
import {CookieBanner} from '@/components/legal/CookieBanner';
import {
    clearConsent,
    type ConsentDecision,
    readConsent,
    writeConsent,
} from '@/lib/consent';

type ConsentState = ConsentDecision | null | undefined;

type ConsentContextValue = {
    decision: ConsentState;
    accept: () => void;
    decline: () => void;
    reopen: () => void;
};

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({children}: {children: React.ReactNode}): React.ReactNode {
    const [decision, setDecision] = useState<ConsentState>(undefined);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        // Intentional post-hydration read: localStorage is unavailable during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDecision(readConsent());
    }, []);

    function accept() {
        writeConsent('accepted');
        setSettingsOpen(false);
        setDecision('accepted');
    }

    function decline() {
        writeConsent('declined');
        setSettingsOpen(false);
        setDecision('declined');
    }

    function reopen() {
        clearConsent();
        setDecision(null);
        setSettingsOpen(true);
    }

    return (
        <ConsentContext.Provider value={{decision, accept, decline, reopen}}>
            {children}
            {decision === 'accepted' && <YandexMetrika/>}
            {decision === null && (
                <CookieBanner
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    onAccept={accept}
                    onDecline={decline}
                />
            )}
        </ConsentContext.Provider>
    );
}

export function useConsent(): ConsentContextValue {
    const context = useContext(ConsentContext);
    if (!context) throw new Error('useConsent must be used within ConsentProvider');
    return context;
}

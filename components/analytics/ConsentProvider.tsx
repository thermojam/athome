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

const INTERACTION_EVENTS: Array<keyof WindowEventMap> = [
    'scroll',
    'touchstart',
    'pointerdown',
    'keydown',
];

const ConsentContext = createContext<ConsentContextValue | undefined>(undefined);

export function ConsentProvider({children}: {children: React.ReactNode}): React.ReactNode {
    const [decision, setDecision] = useState<ConsentState>(undefined);
    const [bannerVisible, setBannerVisible] = useState(false);

    useEffect(() => {
        const storedDecision = readConsent();
        // Intentional post-hydration read: localStorage is unavailable during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDecision(storedDecision);

        if (storedDecision !== null) return;

        function removeRevealListeners() {
            for (const eventName of INTERACTION_EVENTS) {
                window.removeEventListener(eventName, reveal);
            }
        }

        function reveal() {
            setBannerVisible(true);
            removeRevealListeners();
        }

        for (const eventName of INTERACTION_EVENTS) {
            window.addEventListener(eventName, reveal, {passive: true});
        }

        return removeRevealListeners;
    }, []);

    function accept() {
        writeConsent('accepted');
        setBannerVisible(false);
        setDecision('accepted');
    }

    function decline() {
        writeConsent('declined');
        setBannerVisible(false);
        setDecision('declined');
    }

    function reopen() {
        clearConsent();
        setDecision(null);
        setBannerVisible(true);
    }

    return (
        <ConsentContext.Provider value={{decision, accept, decline, reopen}}>
            {children}
            {decision === 'accepted' && <YandexMetrika/>}
            {decision === null && bannerVisible && (
                <CookieBanner onAccept={accept} onDecline={decline}/>
            )}
        </ConsentContext.Provider>
    );
}

export function useConsent(): ConsentContextValue {
    const context = useContext(ConsentContext);
    if (!context) throw new Error('useConsent must be used within ConsentProvider');
    return context;
}

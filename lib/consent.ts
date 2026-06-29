export const CONSENT_STORAGE_KEY = 'athome.consent.v1';
export const CONSENT_POLICY_VERSION = 1;
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export type ConsentDecision = 'accepted' | 'declined';

export type StoredConsent = {
    version: number;
    decision: ConsentDecision;
    timestamp: number;
};

export function readConsent(now = Date.now()): ConsentDecision | null {
    if (typeof window === 'undefined') return null;

    try {
        const rawConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!rawConsent) return null;

        const storedConsent = JSON.parse(rawConsent) as Partial<StoredConsent>;
        if (
            storedConsent.version !== CONSENT_POLICY_VERSION
            || (storedConsent.decision !== 'accepted' && storedConsent.decision !== 'declined')
            || typeof storedConsent.timestamp !== 'number'
            || !Number.isFinite(storedConsent.timestamp)
        ) {
            return null;
        }

        if (now - storedConsent.timestamp > CONSENT_TTL_MS) {
            window.localStorage.removeItem(CONSENT_STORAGE_KEY);
            return null;
        }

        return storedConsent.decision;
    } catch {
        return null;
    }
}

export function writeConsent(decision: ConsentDecision, now = Date.now()): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
            version: CONSENT_POLICY_VERSION,
            decision,
            timestamp: now,
        } satisfies StoredConsent));
    } catch {
        // Consent remains unset when Web Storage is unavailable.
    }
}

export function clearConsent(): void {
    if (typeof window === 'undefined') return;

    try {
        window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
        // Consent remains unchanged when Web Storage is unavailable.
    }
}

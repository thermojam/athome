import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
    clearConsent,
    CONSENT_POLICY_VERSION,
    CONSENT_STORAGE_KEY,
    CONSENT_TTL_MS,
    readConsent,
    writeConsent,
} from '@/lib/consent';

describe('analytics consent storage', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('returns null during SSR', () => {
        vi.stubGlobal('window', undefined);
        expect(readConsent()).toBeNull();
    });

    it('returns null when no decision is stored', () => {
        expect(readConsent()).toBeNull();
    });

    it('stores and reads accepted consent', () => {
        writeConsent('accepted', 1_000);
        expect(readConsent(1_001)).toBe('accepted');
        expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? '')).toEqual({
            version: CONSENT_POLICY_VERSION,
            decision: 'accepted',
            timestamp: 1_000,
        });
    });

    it('stores and reads declined consent', () => {
        writeConsent('declined', 2_000);
        expect(readConsent(2_001)).toBe('declined');
    });

    it('returns null for malformed JSON', () => {
        localStorage.setItem(CONSENT_STORAGE_KEY, '{invalid');
        expect(readConsent()).toBeNull();
    });

    it('returns null for an incompatible policy version', () => {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
            version: CONSENT_POLICY_VERSION + 1,
            decision: 'accepted',
            timestamp: 1_000,
        }));
        expect(readConsent(1_001)).toBeNull();
    });

    it('returns null for an unknown decision', () => {
        localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
            version: CONSENT_POLICY_VERSION,
            decision: 'unknown',
            timestamp: 1_000,
        }));
        expect(readConsent(1_001)).toBeNull();
    });

    it('removes expired consent', () => {
        writeConsent('accepted', 1_000);
        expect(readConsent(1_000 + CONSENT_TTL_MS + 1)).toBeNull();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    });

    it('clears stored consent', () => {
        writeConsent('accepted');
        clearConsent();
        expect(localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
        expect(readConsent()).toBeNull();
    });
});

import type { Goal } from './types';
import {readConsent} from './consent';

declare global {
    interface Window {
        ym?: (id: number, method: string, goal: string) => void;
    }
}

export function reachGoal(goal: Goal): void {
    if (typeof window === 'undefined') return;
    if (readConsent() !== 'accepted') return;
    const ymId = Number(process.env.NEXT_PUBLIC_YM_ID);
    if (!ymId || typeof window.ym !== 'function') return;
    window.ym(ymId, 'reachGoal', goal);
}

import type {ProfileKey, QuizState} from './types';
import {PROFILE_PRIORITY} from './quiz-data';

export const initialState: QuizState = {
    step: 0,
    scores: {health: 0, body: 0, energy: 0},
    finished: false,
    result: null,
};

/** Детерминированный argmax с tie-break по PROFILE_PRIORITY */
export function resolveResult(scores: Record<ProfileKey, number>): ProfileKey {
    let best = PROFILE_PRIORITY[0];
    for (const key of PROFILE_PRIORITY) {
        if (scores[key] > scores[best]) best = key;
    }
    return best;
}

type Action = { type: 'ANSWER'; profile: ProfileKey } | { type: 'RESET' };

export function quizReducer(state: QuizState, action: Action): QuizState {
    switch (action.type) {
        case 'ANSWER': {
            const scores = {...state.scores, [action.profile]: state.scores[action.profile] + 1};
            const step = state.step + 1;
            if (step < 3) return {...state, scores, step};
            return {...state, scores, step, finished: true, result: resolveResult(scores)};
        }
        case 'RESET':
            return initialState;
    }
}

import { describe, it, expect } from 'vitest';
import { quizReducer, resolveResult, initialState } from '@/lib/quiz-logic';

describe('resolveResult (argmax + tie-break health→body→energy)', () => {
  it('returns the unambiguous winner', () => {
    expect(resolveResult({ health: 3, body: 0, energy: 0 })).toBe('health');
    expect(resolveResult({ health: 0, body: 3, energy: 0 })).toBe('body');
    expect(resolveResult({ health: 0, body: 0, energy: 3 })).toBe('energy');
  });

  it('breaks 3-way tie to "health"', () => {
    expect(resolveResult({ health: 1, body: 1, energy: 1 })).toBe('health');
  });

  it('breaks 2-way tie body/energy to "body"', () => {
    expect(resolveResult({ health: 0, body: 1, energy: 1 })).toBe('body');
  });

  it('breaks 2-way tie health/energy to "health"', () => {
    expect(resolveResult({ health: 1, body: 0, energy: 1 })).toBe('health');
  });

  it('breaks 2-way tie health/body to "health"', () => {
    expect(resolveResult({ health: 1, body: 1, energy: 0 })).toBe('health');
  });
});

describe('quizReducer', () => {
  it('advances step on each ANSWER until 3, then finishes', () => {
    let s = quizReducer(initialState, { type: 'ANSWER', profile: 'health' });
    expect(s.step).toBe(1);
    expect(s.finished).toBe(false);
    expect(s.result).toBeNull();

    s = quizReducer(s, { type: 'ANSWER', profile: 'body' });
    expect(s.step).toBe(2);
    expect(s.finished).toBe(false);

    s = quizReducer(s, { type: 'ANSWER', profile: 'energy' });
    expect(s.step).toBe(3);
    expect(s.finished).toBe(true);
    expect(s.scores).toEqual({ health: 1, body: 1, energy: 1 });
    expect(s.result).toBe('health'); // tie-break
  });

  it('produces a 3-health winner when all answers are health', () => {
    let s = quizReducer(initialState, { type: 'ANSWER', profile: 'health' });
    s = quizReducer(s, { type: 'ANSWER', profile: 'health' });
    s = quizReducer(s, { type: 'ANSWER', profile: 'health' });
    expect(s.result).toBe('health');
    expect(s.scores).toEqual({ health: 3, body: 0, energy: 0 });
  });

  it('RESET returns to initialState', () => {
    const dirty = {
      step: 3 as const,
      scores: { health: 2, body: 1, energy: 0 },
      finished: true,
      result: 'health' as const,
    };
    expect(quizReducer(dirty, { type: 'RESET' })).toEqual(initialState);
  });
});

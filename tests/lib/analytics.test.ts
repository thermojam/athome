import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { reachGoal } from '@/lib/analytics';

describe('reachGoal', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    delete window.ym;
  });

  it('is a no-op when window.ym is missing', () => {
    expect(() => reachGoal('quiz_start')).not.toThrow();
  });

  it('calls window.ym with id, "reachGoal", and goal name', () => {
    const ym = vi.fn();
    window.ym = ym;
    reachGoal('quiz_complete');
    expect(ym).toHaveBeenCalledWith(99999999, 'reachGoal', 'quiz_complete');
  });

  it('is a no-op when YM_ID env is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '');
    const ym = vi.fn();
    window.ym = ym;
    reachGoal('quiz_start');
    expect(ym).not.toHaveBeenCalled();
  });

  it('accepts template-literal goals like lead_click_health', () => {
    const ym = vi.fn();
    window.ym = ym;
    reachGoal('lead_click_health');
    expect(ym).toHaveBeenCalledWith(99999999, 'reachGoal', 'lead_click_health');
  });
});

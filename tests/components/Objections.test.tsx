import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Objections } from '@/components/sections/Objections';
import {clearConsent, writeConsent} from '@/lib/consent';

describe('Objections accordion (§15.5)', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
    writeConsent('accepted');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    delete window.ym;
    clearConsent();
  });

  it('renders all questions collapsed by default', () => {
    render(<Objections />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
    for (const btn of buttons) {
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    }
  });

  it('expands a single item on click', async () => {
    const user = userEvent.setup();
    render(<Objections />);
    const first = screen.getAllByRole('button')[0];
    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles to another item, collapses the previous', async () => {
    const user = userEvent.setup();
    render(<Objections />);
    const [a, b] = screen.getAllByRole('button');
    await user.click(a);
    await user.click(b);
    expect(a).toHaveAttribute('aria-expanded', 'false');
    expect(b).toHaveAttribute('aria-expanded', 'true');
  });

  it('fires objection_open goal only on the FIRST expand', async () => {
    const ym = vi.fn();
    window.ym = ym;
    const user = userEvent.setup();
    render(<Objections />);
    const [a, b] = screen.getAllByRole('button');
    await user.click(a);
    await user.click(b);
    await user.click(a);
    const goalCalls = ym.mock.calls.filter((c) => c[2] === 'objection_open');
    expect(goalCalls).toHaveLength(1);
  });
});

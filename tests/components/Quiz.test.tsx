import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Quiz } from '@/components/quiz/Quiz';
import { QUESTIONS, PROFILES } from '@/lib/quiz-data';

describe('Quiz (§15.4)', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_YM_ID', '99999999');
    vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'kamensky_trener');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    delete window.ym;
  });

  it('renders the first question and 0% progress', () => {
    render(<Quiz />);
    expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('advances to the next question on answer', async () => {
    const user = userEvent.setup();
    render(<Quiz />);
    await user.click(screen.getByText(QUESTIONS[0].options[0].label));
    expect(screen.getByText(QUESTIONS[1].title)).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(Number(bar.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  });

  it('shows the result after 3 health answers', async () => {
    const user = userEvent.setup();
    render(<Quiz />);
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(QUESTIONS[i].options[0].label))!);
    }
    expect(screen.getByText(PROFILES.health.title)).toBeInTheDocument();
  });

  it('restarts to the first question on "Пройти заново"', async () => {
    const user = userEvent.setup();
    render(<Quiz />);
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(QUESTIONS[i].options[0].label))!);
    }
    expect(screen.getByText(PROFILES.health.title)).toBeInTheDocument();
    await user.click(screen.getByText(/пройти заново/i));
    expect(screen.getByText(QUESTIONS[0].title)).toBeInTheDocument();
  });

  it('fires quiz_start once on first answer and quiz_complete once on result', async () => {
    const ym = vi.fn();
    window.ym = ym;
    const user = userEvent.setup();
    render(<Quiz />);
    for (let i = 0; i < 3; i++) {
      await user.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(QUESTIONS[i].options[0].label))!);
    }
    const starts = ym.mock.calls.filter((c) => c[2] === 'quiz_start');
    const completes = ym.mock.calls.filter((c) => c[2] === 'quiz_complete');
    expect(starts).toHaveLength(1);
    expect(completes).toHaveLength(1);
  });
});

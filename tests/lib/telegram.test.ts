import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildTelegramLink } from '@/lib/telegram';

describe('buildTelegramLink', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', 'kamensky_trener');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('starts with https://t.me/<username>?text=', () => {
    expect(buildTelegramLink('hi')).toMatch(
      /^https:\/\/t\.me\/kamensky_trener\?text=/,
    );
  });

  it('URL-encodes Cyrillic text', () => {
    const url = buildTelegramLink('привет');
    expect(url).toContain(
      'text=%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82',
    );
  });

  it('handles empty message gracefully', () => {
    expect(buildTelegramLink('')).toBe(
      'https://t.me/kamensky_trener?text=',
    );
  });

  it('throws when Telegram username env is missing', () => {
    vi.stubEnv('NEXT_PUBLIC_TG_USERNAME', '');
    expect(() => buildTelegramLink('hi')).toThrow(
      'NEXT_PUBLIC_TG_USERNAME is required',
    );
  });
});

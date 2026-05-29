import type { ReactNode } from 'react';

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[--line] bg-[--glass] px-3 py-1 text-xs font-mono uppercase tracking-[0.15em] text-tx2">
      {children}
    </span>
  );
}

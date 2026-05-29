import type { ReactNode } from 'react';

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[--radius-lg] border border-[--line] bg-[--glass] p-6 backdrop-blur-[--blur-md] ${className}`}
    >
      {children}
    </div>
  );
}

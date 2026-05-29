export function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.min(100, Math.max(0, (step / total) * 100));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="h-1.5 w-full overflow-hidden rounded-full bg-[--line]"
    >
      <div
        className="h-full bg-cyan transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

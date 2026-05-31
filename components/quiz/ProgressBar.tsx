export function ProgressBar({step, total}: { step: number; total: number }) {
    const pct = Math.min(100, Math.round((step / total) * 100));
    return (
        <div className="flex flex-col gap-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-tx3">
                <span>Прогресс</span>
                <span>{pct}%</span>
            </div>
            <div
                className="h-1.5 w-full overflow-hidden rounded-full"
                style={{backgroundColor: 'rgba(255,255,255,0.05)'}}
            >
                <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--color-cyan), var(--color-violet))',
                        boxShadow: 'var(--glow-cyan)',
                    }}
                />
            </div>
        </div>
    );
}

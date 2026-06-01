import {Activity, TrendingDown, BatteryLow, type LucideIcon} from 'lucide-react';
import {CONTENT} from '@/lib/quiz-data';
import type {ProblemIcon} from '@/lib/types';

const ICON_MAP: Record<'activity' | 'trending-down' | 'battery-low', LucideIcon> = {
    'activity': Activity,
    'trending-down': TrendingDown,
    'battery-low': BatteryLow,
};

function resolveIconKey(c: { iconKey?: ProblemIcon; icon?: ProblemIcon }): 'activity' | 'trending-down' | 'battery-low' {
    const k = (c.iconKey ?? c.icon ?? 'activity');
    if (k === 'activity' || k === 'trending-down' || k === 'battery-low') return k;
    if (k === 'bone') return 'activity';
    if (k === 'repeat') return 'trending-down';
    return 'activity';
}

export function Problem() {
    const {kicker, h2, cards, summaryLead, summaryRest} = CONTENT.problem;
    return (
        <section
            id="pain"
            className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28"
        >
            <div className="flex flex-col gap-4">
                <span className="kicker">◆ {kicker}</span>
                <h2 className="font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                    {h2}
                </h2>
            </div>

            <div data-testid="pain-row" className="mt-10 grid gap-5 md:grid-cols-3">
                {cards.map((c) => {
                    const key = resolveIconKey(c);
                    const Icon = ICON_MAP[key];
                    return (
                        <div key={c.title} data-testid="pain-card" className="card-md flex flex-col gap-4">
                            <span
                                data-icon={key}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl"
                                style={{
                                    border: '1px solid rgba(44,230,255,0.35)',
                                    boxShadow: 'inset 0 0 14px rgba(44,230,255,0.18), var(--edge-highlight)',
                                    color: 'var(--color-cyan)',
                                    background: 'rgba(44,230,255,0.04)',
                                }}
                                aria-hidden
                            >
                                <Icon size={22} strokeWidth={1.7}/>
                            </span>
                            <h3 className="font-display text-lg uppercase tracking-tight text-tx">
                                {c.title}
                            </h3>
                            <p className="text-sm text-tx2">{c.text}</p>
                        </div>
                    );
                })}
            </div>

            <div className="card mt-10">
                <p className="text-base text-tx">
                    <span className="text-cyan">{summaryLead}</span>{' '}
                    <span className="text-tx2">{summaryRest}</span>
                </p>
            </div>
        </section>
    );
}
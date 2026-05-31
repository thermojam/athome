import {CONTENT} from '@/lib/quiz-data';

export function Transformation() {
    const {kicker, h2, before, bridge, after, afterItems} = CONTENT.transformation;
    return (
        <section
            id="bab"
            className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28"
        >
            <div className="flex flex-col gap-4">
                <span className="kicker">◆ {kicker}</span>
                <h2 className="font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                    {h2}
                </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
                {/* BEFORE */}
                <div className="card">
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-tx3">
                        Сейчас
                    </p>
                    <ul className="mt-5 flex flex-col">
                        {before.map((line) => (
                            <li
                                key={line}
                                className="hairline py-3 text-base text-tx2"
                            >
                                {line}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* AFTER */}
                <div
                    className="card"
                    style={{boxShadow: 'var(--edge-highlight), var(--lift), var(--glow-cyan)'}}
                >
                    <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
                        {after}
                    </p>
                    <ul className="mt-5 flex flex-col">
                        {afterItems.map((line) => (
                            <li
                                key={line}
                                className="hairline py-3 text-base text-tx"
                            >
                                {line}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8 text-center">
                <span className="pill" style={{color: 'var(--color-cyan)'}}>
                    → {bridge} →
                </span>
            </div>
        </section>
    );
}

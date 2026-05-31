import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {Bridge} from '@/components/ui/Bridge';

export function Map() {
    return (
        <section id="map" className="border-b border-[--line] bg-bg-primary px-4 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.map.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.map.h2}
                </h2>
                <p className="mt-4 max-w-2xl text-base text-tx2">{CONTENT.map.sub}</p>

                <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_1.4fr]">
                    <ul className="space-y-3">
                        {CONTENT.map.points.map((p) => (
                            <li
                                key={p.name}
                                className="flex items-baseline justify-between rounded-[--radius-md] border border-[--line] bg-[--glass] px-4 py-3"
                            >
                                <span className="font-display text-base text-tx">{p.name}</span>
                                <span className="font-mono text-sm text-cyan">{p.time}</span>
                            </li>
                        ))}
                    </ul>

                    <div
                        className="relative aspect-square w-full overflow-hidden rounded-[--radius-xl] border border-[--line] bg-bg3">
                        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                            <circle cx="50" cy="50" r="3" fill="var(--color-cyan)"/>
                            <circle cx="50" cy="50" r="18" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.25"/>
                            <circle cx="50" cy="50" r="32" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.15"/>
                            <circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-cyan)" strokeOpacity="0.08"/>
                            <text x="50" y="62" textAnchor="middle" fontSize="3.2" fill="var(--color-tx2)"
                                  fontFamily="var(--font-mono)">
                                {CONTENT.map.center}
                            </text>
                        </svg>
                    </div>
                </div>

                <p className="mt-8 text-sm text-tx3">{CONTENT.map.caption}</p>
                <Bridge data={BRIDGES.toTransformation}/>
            </div>
        </section>
    );
}

import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {GlassCard} from '@/components/ui/GlassCard';
import {Bridge} from '@/components/ui/Bridge';

export function Transformation() {
    return (
        <section id="bab" className="border-b border-[--line] bg-bg2 px-4 py-20 md:py-28">
            <div className="mx-auto max-w-5xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.transformation.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.transformation.h2}
                </h2>

                <div className="mt-10 grid gap-4 md:grid-cols-2">
                    <GlassCard>
                        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-tx3">сейчас</h3>
                        <ul className="mt-4 space-y-2 text-tx2">
                            {CONTENT.transformation.before.map((b) => (
                                <li key={b} className="flex gap-2">
                                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-tx3" aria-hidden/>
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>

                    <GlassCard className="border-cyan/40 bg-cyan/[0.04]">
                        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">{CONTENT.transformation.after}</h3>
                        <ul className="mt-4 space-y-2 text-tx">
                            {CONTENT.transformation.afterItems.map((a) => (
                                <li key={a} className="flex gap-2">
                                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-cyan" aria-hidden/>
                                    <span>{a}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                </div>

                <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.transformation.bridge}
                </p>

                <Bridge data={BRIDGES.toQuiz}/>
            </div>
        </section>
    );
}

import { CONTENT, BRIDGES } from '@/lib/quiz-data';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bridge } from '@/components/ui/Bridge';
import { Reveal } from '@/components/ui/Reveal';

export function Problem() {
  return (
    <section id="pain" className="border-b border-[--line] bg-bg2 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
          {CONTENT.problem.kicker}
        </p>
        <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
          {CONTENT.problem.h2}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {CONTENT.problem.cards.map((c, i) => (
            <li key={c.title}>
              <Reveal delayMs={i * 80}>
                <GlassCard className="h-full">
                  <div className="text-3xl" aria-hidden>{c.emoji}</div>
                  <h3 className="mt-3 font-display text-lg text-tx">{c.title}</h3>
                  <p className="mt-2 text-sm text-tx2">{c.text}</p>
                </GlassCard>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-base text-tx">
          <span className="font-semibold">{CONTENT.problem.summaryLead}</span>{' '}
          <span className="text-tx2">{CONTENT.problem.summaryRest}</span>
        </p>
        <Bridge data={BRIDGES.toMap} />
      </div>
    </section>
  );
}

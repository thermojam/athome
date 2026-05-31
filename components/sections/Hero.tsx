import {Send} from 'lucide-react';
import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {Pill} from '@/components/ui/Pill';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function Hero() {
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section
            id="hero"
            className="relative isolate mx-auto w-full max-w-[var(--container)] overflow-hidden px-4 pb-20 pt-24 md:pb-28 md:pt-32"
        >
            <div className="flex flex-col gap-6">
                <span className="kicker">◆ {CONTENT.hero.kicker}</span>
                <h1 className="font-display text-4xl uppercase leading-[1.04] tracking-tight text-tx md:text-6xl">
                    {CONTENT.hero.h1}
                </h1>
                <p className="max-w-2xl text-base text-tx2 md:text-lg">
                    {CONTENT.hero.sub}
                </p>
                <ul className="flex flex-wrap gap-2">
                    {CONTENT.hero.pills.map((p) => (
                        <li key={p}>
                            <Pill>{p}</Pill>
                        </li>
                    ))}
                </ul>
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href="#test" className="btn btn-lg btn-primary">
                        {CONTENT.hero.cta}
                    </a>
                    <TrackedLink
                        href={tgHref}
                        goal="lead_click_direct"
                        external
                        className="btn btn-lg btn-secondary"
                    >
                        <Send size={18} strokeWidth={1.8} aria-hidden/>
                        Сразу написать
                    </TrackedLink>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-tx3">
                    {CONTENT.hero.microcopy}
                </p>
            </div>
        </section>
    );
}

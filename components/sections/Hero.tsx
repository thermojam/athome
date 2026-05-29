import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {Pill} from '@/components/ui/Pill';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function Hero() {
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section
            className="relative isolate overflow-hidden border-b border-[--line] bg-bg-primary px-4 pb-16 pt-20 md:pb-24 md:pt-28">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.hero.kicker}
                </p>
                <h1 className="font-display text-3xl leading-tight text-tx md:text-5xl">
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
                    <a
                        href="#test"
                        className="rounded-full bg-cyan px-6 py-3 text-center text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                    >
                        {CONTENT.hero.cta}
                    </a>
                    <TrackedLink
                        href={tgHref}
                        goal="lead_click_direct"
                        external
                        className="rounded-full border border-[--line] bg-[--glass] px-6 py-3 text-center text-sm text-tx transition-colors hover:border-cyan hover:text-cyan"
                    >
                        ✈ Сразу написать
                    </TrackedLink>
                </div>
                <p className="text-xs text-tx3">{CONTENT.hero.microcopy}</p>
            </div>
        </section>
    );
}

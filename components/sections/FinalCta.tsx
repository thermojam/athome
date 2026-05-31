import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function FinalCta() {
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section id="cta" className="bg-bg-primary px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.finalCta.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.finalCta.h2}
                </h2>
                <p className="mt-4 text-base text-tx2">{CONTENT.finalCta.text}</p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <a
                        href="#test"
                        className="rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                    >
                        {CONTENT.finalCta.cta1}
                    </a>
                    <TrackedLink
                        href={tgHref}
                        goal="lead_click_direct"
                        external
                        className="rounded-full border border-[--line] bg-[--glass] px-6 py-3 text-sm text-tx transition-colors hover:border-cyan hover:text-cyan"
                    >
                        {CONTENT.finalCta.cta2}
                    </TrackedLink>
                </div>

                <p className="mt-6 text-xs text-tx3">{CONTENT.finalCta.guarantee}</p>
            </div>
        </section>
    );
}

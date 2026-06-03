import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function FinalCta() {
    const {kicker, h2, lead, cta1, cta2, microcopy} = CONTENT.finalCta;
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section
            id="final"
            className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28 text-center"
        >
            <span className="kicker">{kicker}</span>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">{h2}</h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-tx2">{lead}</p>
            <div className="final-cta-row mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a href="#test" className="btn btn-lg btn-primary">{cta1}</a>
                <TrackedLink
                    href={tgHref}
                    goal="lead_click_direct"
                    external
                    className="btn btn-lg btn-secondary"
                >
                    {cta2}
                </TrackedLink>
            </div>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-tx3">{microcopy}</p>
        </section>
    );
}
import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function FinalCta() {
    const {kicker, h2, text, cta1, cta2, guarantee} = CONTENT.finalCta;
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);
    return (
        <section
            id="final"
            className="mx-auto w-full max-w-3xl px-4 py-20 md:py-28"
        >
            <div className="card text-center">
                <span className="kicker">◆ {kicker}</span>
                <h2 className="mt-4 font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                    {h2}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-base text-tx2">{text}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <a href="#test" className="btn btn-primary">
                        {cta1}
                    </a>
                    <TrackedLink
                        href={tgHref}
                        goal="lead_click_direct"
                        external
                        className="btn btn-secondary"
                    >
                        {cta2}
                    </TrackedLink>
                </div>
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-tx3">
                    {guarantee}
                </p>
            </div>
        </section>
    );
}

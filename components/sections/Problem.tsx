import {CONTENT} from '@/lib/quiz-data';

export function Problem() {
    const {kicker, h2, cards, summaryLead, summaryRest} = CONTENT.problem;
    return (
        <section
            id="pain"
            className="mx-auto w-full max-w-4xl px-4 py-20 md:py-28"
        >
            <div className="flex flex-col gap-4">
                <span className="kicker">◆ {kicker}</span>
                <h2 className="font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                    {h2}
                </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
                {cards.map((c) => (
                    <div key={c.title} className="card-md flex flex-col gap-3">
                        <span className="text-3xl" aria-hidden>
                            {c.emoji}
                        </span>
                        <h3 className="font-display text-lg uppercase tracking-tight text-tx">
                            {c.title}
                        </h3>
                        <p className="text-sm text-tx2">{c.text}</p>
                    </div>
                ))}
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

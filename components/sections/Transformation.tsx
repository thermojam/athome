import {Clock, CirclePlus, Zap, CircleCheckBig} from 'lucide-react';
import {CONTENT} from '@/lib/quiz-data';

const ICONS = {
    'clock': Clock,
    'circle-plus': CirclePlus,
    'zap': Zap,
    'circle-check-big': CircleCheckBig,
} as const;

export function Transformation() {
    const {kicker, h2, lead, steps} = CONTENT.transformation;
    return (
        <section id="bab" className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28">
            <div className="text-center">
                <span className="kicker">{kicker}</span>
                <h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">{h2}</h2>
                <p className="mx-auto mt-3 max-w-2xl text-base text-tx2 md:text-lg">{lead}</p>
            </div>
            <div className="tr-track">
                <div className="tr-line"/>
                <div className="tr-steps">
                    {steps.map((s) => {
                        const Ico = ICONS[s.iconKey];
                        return (
                            <div className={`tr-step ${s.tone}`} key={s.title}>
                                <div className="tr-node">
                                    <Ico size={30} strokeWidth={1.7} aria-hidden/>
                                </div>
                                <div className="tr-week">{s.week}</div>
                                <h3 className="font-display uppercase tracking-tight">{s.title}</h3>
                                <p>{s.text}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
import {CONTENT} from '@/lib/quiz-data';
import {HeroBackground} from '@/components/sections/HeroBackground';

export function Hero() {
    const {kicker, h1Lead, h1Accent, sub, cta, ctaSecondary, microcopy} = CONTENT.hero;
    return (
        <section id="hero" className="hero relative isolate overflow-hidden">
            <HeroBackground/>
            <div className="hero-content mx-auto w-full max-w-[var(--container)] px-4 pb-20 pt-24 md:pb-28 md:pt-32">
                <div className="flex flex-col gap-6">
                    <span className="kicker">{kicker}</span>
                    <h1 className="font-display text-4xl uppercase leading-[1.04] tracking-tight text-tx md:text-6xl whitespace-pre-line">
                        {h1Lead}
                        {'\n'}
                        <span className="accent">{h1Accent}</span>
                    </h1>
                    <p className="max-w-2xl text-base text-tx2 md:text-lg">{sub}</p>
                    <div className="cta-row mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <a href="#test" className="btn btn-lg btn-primary">{cta}</a>
                        <a href="#booking" className="btn btn-lg btn-secondary">{ctaSecondary}</a>
                    </div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-tx3">{microcopy}</p>
                </div>
            </div>
        </section>
    );
}

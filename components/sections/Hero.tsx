import {CONTENT} from '@/lib/quiz-data';
import {HeroBackground} from '@/components/sections/HeroBackground';

export function Hero() {
    const {kicker, h1Lead, h1Accent, sub, cta, ctaSecondary, microcopy} = CONTENT.hero;
    return (
        <section id="hero" className="hero relative isolate overflow-hidden">
            <HeroBackground/>
            <div className="absolute left-0 right-0 top-3 z-10 mx-auto w-full max-w-[var(--container)] px-4 md:top-4">
                <img
                    src="/logo.svg"
                    alt="Логотип НК"
                    className="h-16 w-16 md:h-20 md:w-20"
                />
            </div>
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

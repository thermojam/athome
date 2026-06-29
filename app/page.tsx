import {Hero} from '@/components/sections/Hero';
import {AboutTrainer} from '@/components/sections/AboutTrainer';
import {Problem} from '@/components/sections/Problem';
import {LocationMap} from '@/components/sections/LocationMap';
import {Transformation} from '@/components/sections/Transformation';
import {Quiz} from '@/components/quiz/Quiz';
import {BookingSlot} from '@/components/sections/BookingSlot';
import {Objections} from '@/components/sections/Objections';
import {FinalCta} from '@/components/sections/FinalCta';
import {StickyCta} from '@/components/ui/StickyCta';
import {Bridge} from '@/components/ui/Bridge';
import {Reveal} from '@/components/ui/Reveal';
import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {CookieSettingsButton} from '@/components/legal/CookieSettingsButton';

export default function Home() {
    return (
        <>
            <Hero/>
            {/* нет мостика Hero → About (мягкий переход — знакомство сразу) */}
            <Reveal><AboutTrainer/></Reveal>
            <Reveal><Bridge data={BRIDGES.toProblem}/></Reveal>
            <Reveal><Problem/></Reveal>
            <Reveal><Bridge data={BRIDGES.toMap}/></Reveal>
            <Reveal><LocationMap/></Reveal>
            <Reveal><Bridge data={BRIDGES.toTransformation}/></Reveal>
            <Reveal><Transformation/></Reveal>
            <Reveal><Bridge data={BRIDGES.toQuiz}/></Reveal>
            <Reveal><Quiz/></Reveal>
            <Reveal><Bridge data={BRIDGES.toObjections}/></Reveal>
            <Reveal><Objections/></Reveal>
            <Reveal><Bridge data={BRIDGES.toBooking}/></Reveal>
            <Reveal><BookingSlot/></Reveal>
            <Reveal><FinalCta/></Reveal>
            <footer className="mx-auto w-full max-w-[var(--container)] px-4 py-12 text-center">
                <div className="border-t border-[--line-soft] pt-10">
                    <img
                        src="/logo.svg"
                        alt="Логотип НК"
                        className="mx-auto h-20 w-20"
                    />
                    <p className="font-display text-xl uppercase tracking-tight text-tx">
                        {CONTENT.footer.brand}
                    </p>
                    <p className="mt-2 text-sm text-tx2">
                        {CONTENT.footer.name} · {CONTENT.footer.tagline}
                    </p>
                    <p className="mt-5 text-xs text-tx3">
                        <a href="/privacy/" className="underline hover:text-tx2">
                            Политика конфиденциальности
                        </a>
                        {' · '}
                        <a href="/cookies/" className="underline hover:text-tx2">
                            Cookies
                        </a>
                        {' · '}
                        <CookieSettingsButton/>
                    </p>
                </div>
            </footer>
            <StickyCta/>
        </>
    );
}

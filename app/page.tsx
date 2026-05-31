import {Hero} from '@/components/sections/Hero';
import {Problem} from '@/components/sections/Problem';
import {LocationMap} from '@/components/sections/LocationMap';
import {Transformation} from '@/components/sections/Transformation';
import {Quiz} from '@/components/quiz/Quiz';
import {BookingSlot} from '@/components/sections/BookingSlot';
import {Objections} from '@/components/sections/Objections';
import {FinalCta} from '@/components/sections/FinalCta';
import {StickyCta} from '@/components/ui/StickyCta';
import {Bridge} from '@/components/ui/Bridge';
import {CONTENT, BRIDGES} from '@/lib/quiz-data';

export default function Home() {
    return (
        <>
            <Hero/>
            <Bridge data={BRIDGES.toProblem}/>
            <Problem/>
            <Bridge data={BRIDGES.toMap}/>
            <LocationMap/>
            <Bridge data={BRIDGES.toTransformation}/>
            <Transformation/>
            <Bridge data={BRIDGES.toQuiz}/>
            <Quiz/>
            <Bridge data={BRIDGES.toBooking}/>
            <BookingSlot/>
            <Bridge data={BRIDGES.toObjections}/>
            <Objections/>
            <FinalCta/>
            <footer className="mx-auto w-full max-w-4xl px-4 py-12 text-center">
                <div className="border-t border-[--line-soft] pt-10">
                    <p className="font-display text-base uppercase tracking-tight text-tx">
                        {CONTENT.footer.name}
                    </p>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-tx3">
                        {CONTENT.footer.tagline}
                    </p>
                    <p className="mt-5 text-xs text-tx3">
                        <a href="/privacy" className="underline hover:text-tx2">
                            Политика конфиденциальности
                        </a>
                    </p>
                </div>
            </footer>
            <StickyCta/>
        </>
    );
}

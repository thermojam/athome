import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import {LocationMap} from '@/components/sections/LocationMap';
import { Transformation } from '@/components/sections/Transformation';
import { Quiz } from '@/components/quiz/Quiz';
import { Objections } from '@/components/sections/Objections';
import { FinalCta } from '@/components/sections/FinalCta';
import { StickyCta } from '@/components/ui/StickyCta';
import { CONTENT } from '@/lib/quiz-data';

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <LocationMap />
      <Transformation />
      <Quiz />
      <Objections />
      <FinalCta />
      <footer className="border-t border-[--line] bg-bg2 px-4 py-10 text-center">
        <p className="font-display text-base text-tx">{CONTENT.footer.name}</p>
        <p className="mt-2 text-xs text-tx3">{CONTENT.footer.tagline}</p>
        <p className="mt-4 text-xs text-tx3">
          <a href="/privacy" className="underline hover:text-tx2">
            Политика конфиденциальности
          </a>
        </p>
      </footer>
      <StickyCta />
    </>
  );
}

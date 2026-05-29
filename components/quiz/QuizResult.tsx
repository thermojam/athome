import type {Profile} from '@/lib/types';
import {CONTENT} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

export function QuizResult({
                               profile,
                               onRestart,
                           }: {
    profile: Profile;
    onRestart: () => void;
}) {
    const tgHref = buildTelegramLink(profile.tgMessage);
    return (
        <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">{profile.badge}</p>
            <h3 className="mt-2 font-display text-2xl text-tx md:text-3xl">{profile.title}</h3>
            <p className="mt-4 text-base text-tx2">{profile.body}</p>

            <div className="mt-8 rounded-[--radius-lg] border border-[--line] bg-[--glass] p-6">
                <h4 className="font-display text-lg text-tx">{profile.offerTitle}</h4>
                <p className="mt-3 text-sm text-tx2">{profile.offerText}</p>
            </div>

            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <TrackedLink
                    href={tgHref}
                    goal={`lead_click_${profile.key}` as const}
                    external
                    className="rounded-full bg-cyan px-6 py-3 text-center text-sm font-semibold text-bg-primary transition-opacity hover:opacity-90"
                >
                    Записаться на бесплатную встречу
                </TrackedLink>
                <button
                    type="button"
                    onClick={onRestart}
                    className="rounded-full border border-[--line] bg-[--glass] px-6 py-3 text-center text-sm text-tx2 transition-colors hover:text-tx"
                >
                    {CONTENT.quiz.restart}
                </button>
            </div>

            <p className="mt-4 text-xs text-tx3">{CONTENT.quiz.resultNote}</p>
        </div>
    );
}

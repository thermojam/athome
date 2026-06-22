import type {Profile} from '@/lib/types';
import {CONTENT} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

const profileGlow: Record<string, string> = {
    '--color-green': 'var(--glow-green)',
    '--color-pink': 'var(--glow-pink)',
    '--color-orange': 'var(--glow-orange)',
};

export function QuizResult({
    profile,
    onRestart,
}: {
    profile: Profile;
    onRestart: () => void;
}) {
    const tgHref = buildTelegramLink(profile.tgMessage);
    const glow = profileGlow[profile.colorVar] ?? 'var(--glow-cyan)';

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{
                        backgroundColor: `var(${profile.colorVar})`,
                        boxShadow: glow,
                    }}
                    aria-hidden
                />
                <span
                    className="font-mono text-xs uppercase tracking-[0.18em]"
                    style={{color: `var(${profile.colorVar})`}}
                >
                    {profile.badge}
                </span>
            </div>

            <h3 className="font-display text-2xl uppercase tracking-tight text-tx md:text-3xl">
                {profile.title}
            </h3>
            <p className="text-base text-tx2">{profile.body}</p>

            <div className="mt-2 border-t border-[--line-soft] pt-5">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-tx3">
                    {profile.offerTitle}
                </p>
                <p className="mt-2 text-base text-tx">{profile.offerText}</p>
            </div>

            <p className="text-xs text-tx3">{CONTENT.quiz.resultNote}</p>

            <div className="mt-2 flex min-w-0 flex-col gap-3 sm:flex-row">
                <TrackedLink
                    href={tgHref}
                    goal={`lead_click_${profile.key}` as const}
                    external
                    className="btn btn-lg btn-primary w-full min-w-0 whitespace-normal text-center sm:w-auto"
                >
                    Записаться на встречу
                </TrackedLink>
                <button
                    type="button"
                    onClick={onRestart}
                    className="btn btn-lg btn-secondary w-full min-w-0 whitespace-normal text-center sm:w-auto"
                >
                    {CONTENT.quiz.restart}
                </button>
            </div>
        </div>
    );
}

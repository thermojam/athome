import type {QuizQuestion as QQ, ProfileKey} from '@/lib/types';

export function QuizQuestion({
    question,
    onAnswer,
}: {
    question: QQ;
    onAnswer: (profile: ProfileKey) => void;
}) {
    return (
        <div className="flex flex-col gap-5">
            <p
                className="font-mono text-xs uppercase tracking-[0.18em] text-tx3"
                aria-label="номер вопроса"
            >
                Вопрос {question.id} / 3
            </p>
            <h3 className="font-display text-xl uppercase tracking-tight text-tx md:text-2xl">
                {question.title}
            </h3>
            <div className="flex flex-col gap-3">
                {question.options.map((opt) => (
                    <button
                        key={opt.label}
                        type="button"
                        onClick={() => onAnswer(opt.scores)}
                        className="card-sm hairline flex flex-col items-start gap-1 text-left transition-all hover:!border-cyan"
                        style={{borderRadius: 'var(--radius-md)'}}
                    >
                        <span className="text-base text-tx">{opt.label}</span>
                        <span className="text-sm text-tx3">{opt.sub}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

import type {QuizQuestion as Q, ProfileKey} from '@/lib/types';

export function QuizQuestion({
                                 question,
                                 onAnswer,
                             }: {
    question: Q;
    onAnswer: (profile: ProfileKey) => void;
}) {
    return (
        <div>
            <h3 className="font-display text-xl text-tx md:text-2xl">{question.title}</h3>
            <ul className="mt-6 grid gap-3">
                {question.options.map((opt) => (
                    <li key={opt.label}>
                        <button
                            type="button"
                            onClick={() => onAnswer(opt.scores)}
                            className="block w-full rounded-[--radius-md] border border-[--line] bg-[--glass] px-5 py-4 text-left transition-colors hover:border-cyan"
                        >
                            <div className="font-medium text-tx">{opt.label}</div>
                            <div className="mt-1 text-sm text-tx2">{opt.sub}</div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

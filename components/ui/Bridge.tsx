import type {BridgeContent} from '@/lib/types';

/**
 * Мостик между секциями: короткий вопрос + .pill-кнопка-якорь.
 * SPEC §6. Премиум-стиль через .pill и hover-glow.
 */
export function Bridge({data}: { data: BridgeContent }) {
    return (
        <div className="my-16 flex flex-col items-center gap-4 px-4 text-center md:my-20">
            <p className="font-display text-xl uppercase tracking-tight text-tx2 md:text-2xl">
                {data.question}
            </p>
            <a
                href={data.href}
                className="pill transition-colors hover:!border-cyan hover:!text-cyan"
                style={{cursor: 'pointer'}}
            >
                {data.cta} <span aria-hidden>→</span>
            </a>
        </div>
    );
}

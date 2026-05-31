'use client';

import {useRef, useState} from 'react';
import {CONTENT, BRIDGES} from '@/lib/quiz-data';
import {Bridge} from '@/components/ui/Bridge';
import {reachGoal} from '@/lib/analytics';

export function Objections() {
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const goalSent = useRef(false);

    const toggle = (idx: number) => {
        setOpenIdx((prev) => (prev === idx ? null : idx));
        if (!goalSent.current) {
            goalSent.current = true;
            reachGoal('objection_open');
        }
    };

    return (
        <section id="objections" className="border-b border-[--line] bg-bg2 px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-tx2">
                    {CONTENT.objections.kicker}
                </p>
                <h2 className="mt-2 font-display text-2xl text-tx md:text-4xl">
                    {CONTENT.objections.h2}
                </h2>

                <ul className="mt-8 space-y-3">
                    {CONTENT.objections.items.map((item, idx) => {
                        const open = openIdx === idx;
                        const panelId = `obj-panel-${idx}`;
                        return (
                            <li key={item.q} className="rounded-[--radius-md] border border-[--line] bg-[--glass]">
                                <button
                                    type="button"
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                    aria-expanded={open}
                                    aria-controls={panelId}
                                    onClick={() => toggle(idx)}
                                >
                                    <span className="font-display text-base text-tx md:text-lg">{item.q}</span>
                                    <span className="font-mono text-tx2" aria-hidden>{open ? '−' : '+'}</span>
                                </button>
                                {open && (
                                    <div id={panelId} className="px-5 pb-5 text-sm text-tx2">
                                        {item.a}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <Bridge data={BRIDGES.toQuiz}/>
            </div>
        </section>
    );
}

'use client';

import {useRef, useState} from 'react';
import {CONTENT} from '@/lib/quiz-data';
import {reachGoal} from '@/lib/analytics';

export function Objections() {
    const {kicker, h2, items} = CONTENT.objections;
    const [openIdx, setOpenIdx] = useState<number | null>(null);
    const firedRef = useRef(false);

    const handleToggle = (i: number) => {
        const willOpen = openIdx !== i;
        setOpenIdx(willOpen ? i : null);
        if (willOpen && !firedRef.current) {
            firedRef.current = true;
            reachGoal('objection_open');
        }
    };

    return (
        <section
            id="objections"
            className="mx-auto w-full max-w-3xl px-4 py-20 md:py-28"
        >
            <div className="flex flex-col gap-4">
                <span className="kicker">◆ {kicker}</span>
                <h2 className="font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                    {h2}
                </h2>
            </div>

            <div className="card mt-10">
                {items.map((item, i) => {
                    const open = openIdx === i;
                    return (
                        <div key={item.q} className="hairline">
                            <button
                                type="button"
                                aria-expanded={open}
                                onClick={() => handleToggle(i)}
                                className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-cyan"
                            >
                                <span className="font-display text-base uppercase tracking-tight text-tx md:text-lg">
                                    {item.q}
                                </span>
                                <span
                                    aria-hidden
                                    className="font-mono text-cyan transition-transform"
                                    style={{transform: open ? 'rotate(45deg)' : 'rotate(0deg)'}}
                                >
                                    +
                                </span>
                            </button>
                            {open && (
                                <div className="pb-5 text-base text-tx2">{item.a}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

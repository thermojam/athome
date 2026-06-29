'use client';

import {useMemo, useState} from 'react';
import {CONTENT} from '@/lib/quiz-data';
import {SLOTS} from '@/lib/slots-data';
import {buildTelegramLink} from '@/lib/telegram';
import {reachGoal} from '@/lib/analytics';

const DAY_ABBR: Record<string, string> = {
    'Понедельник': 'Пн',
    'Вторник': 'Вт',
    'Среда': 'Ср',
    'Четверг': 'Чт',
    'Пятница': 'Пт',
    'Суббота': 'Сб',
    'Воскресенье': 'Вс',
};

export function BookingSlot() {
    const {kicker, h2, slotMeta, badgeFree, pickLabel, ctaLabel, honestyNote} = CONTENT.booking;
    const [selectedId, setSelectedId] = useState<string>(SLOTS[0].id);
    const selected = useMemo(() => SLOTS.find((s) => s.id === selectedId) ?? SLOTS[0], [selectedId]);

    const tgMessage = `Привет! Хочу записаться на персональную тренировку. Удобное время: ${selected.day} ${selected.time}. Зал у дома (Приморский пр., 56).`;
    const href = buildTelegramLink(tgMessage);

    function onPick(id: string) {
        setSelectedId(id);
        reachGoal('slot_select');
    }

    function onTake() {
        reachGoal('slot_take');
    }

    return (
        <section id="booking" className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28">
            <div className="text-center mb-8">
                <span className="kicker">{kicker}</span>
                <h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">{h2}</h2>
            </div>
            <div className="card slot-wrap mx-auto max-w-[600px]">
                <div className="slot-top flex items-start justify-between gap-4">
                    <div>
                        <div className="slot-when font-display text-2xl text-tx">
                            {selected.day}
                            <span className="d mx-1 text-tx3">·</span>
                            {selected.time}
                        </div>
                        <div className="slot-meta mt-2 text-tx2 text-sm">{slotMeta}</div>
                    </div>
                    <span
                        className="badge-free font-mono uppercase text-[12px] tracking-[2px] text-[color:var(--color-green)] px-4 py-2 rounded-full border"
                        style={{
                            borderColor: 'rgba(54,255,157,0.5)',
                            background: 'rgba(54,255,157,0.06)',
                            boxShadow: 'inset 0 0 12px rgba(54,255,157,0.12)',
                        }}
                    >
                        {badgeFree}
                    </span>
                </div>

                <div className="slot-pick-label mt-6 mb-3 font-mono text-[11px] uppercase tracking-[2px] text-tx3">{pickLabel}</div>

                <div className="slot-grid">
                    {SLOTS.map((s) => {
                        const isSelected = s.id === selectedId;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => onPick(s.id)}
                                className={`slot-chip rounded-xl border px-2 py-3 text-center text-sm font-semibold text-tx transition ${isSelected ? 'selected' : ''}`}
                                style={{
                                    borderColor: isSelected ? 'var(--color-cyan)' : 'var(--line)',
                                    background: isSelected ? 'rgba(44,230,255,0.08)' : 'rgba(255,255,255,0.02)',
                                    boxShadow: isSelected
                                        ? 'var(--edge-highlight), 0 0 0 1px rgba(44,230,255,0.4), 0 6px 20px rgba(44,230,255,0.18)'
                                        : 'var(--edge-highlight)',
                                }}
                            >
                                {DAY_ABBR[s.day] ?? s.day.slice(0, 2)}
                                <span className="block font-mono text-[11px] text-tx3 mt-1">{s.time}</span>
                            </button>
                        );
                    })}
                </div>

                <a
                    href={href}
                    target="_blank"
                    rel="noopener"
                    onClick={onTake}
                    className="btn btn-md btn-primary btn-take"
                    data-testid="booking-cta"
                >
                    {ctaLabel}
                </a>

                <p className="slot-honest mt-3 font-mono text-[11px] text-tx3 text-center">{honestyNote}</p>
            </div>
        </section>
    );
}

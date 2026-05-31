'use client';

import {useMemo, useState} from 'react';
import {SLOTS} from '@/lib/slots-data';
import {CONTENT} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {reachGoal} from '@/lib/analytics';
import type {ProfileKey} from '@/lib/types';

const profileGlow: Record<ProfileKey, string> = {
    health: 'var(--glow-green)',
    body: 'var(--glow-pink)',
    energy: 'var(--glow-orange)',
};
const profileColor: Record<ProfileKey, string> = {
    health: 'var(--color-green)',
    body: 'var(--color-pink)',
    energy: 'var(--color-orange)',
};

/**
 * Секция записи (SPEC §9). Честный MVP:
 * — выбор чипа → ссылка в Telegram с текстом «удобное время: …».
 * — НЕ резервирует слот, НЕТ статуса «забронировано» в DOM.
 */
export function BookingSlot() {
    const {kicker, h2, body, pillGym, ctaLabel, honestyNote} = CONTENT.booking;
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selected = useMemo(
        () => SLOTS.find((s) => s.id === selectedId) ?? null,
        [selectedId]
    );

    const tgHref = selected
        ? buildTelegramLink(
              `Привет! Хочу записаться на персональную тренировку. ` +
              `Удобное время: ${selected.day}, ${selected.time}. ` +
              `Зал у дома (Приморский пр., 56).`
          )
        : undefined;

    const handlePick = (id: string) => {
        setSelectedId(id);
        reachGoal('slot_select');
    };

    const handleTake = () => {
        if (!selected) return;
        reachGoal('slot_take');
    };

    return (
        <section
            id="booking"
            className="mx-auto w-full max-w-3xl px-4 py-20 md:py-28"
        >
            <div className="card">
                <div className="flex flex-col gap-3">
                    <span className="kicker">◆ {kicker}</span>
                    <h2 className="font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                        {h2}
                    </h2>
                    <p className="text-base text-tx2">{body}</p>
                    <div className="mt-2">
                        <span className="pill">{pillGym}</span>
                    </div>
                </div>

                <div
                    className="mt-8 grid gap-3"
                    style={{gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))'}}
                >
                    {SLOTS.map((slot) => {
                        const isActive = slot.id === selectedId;
                        return (
                            <button
                                key={slot.id}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => handlePick(slot.id)}
                                className="card-sm relative flex flex-col items-start gap-1.5 text-left transition-all hover:!border-cyan"
                                style={
                                    isActive
                                        ? {
                                              boxShadow:
                                                  '0 0 0 2px var(--color-cyan), var(--glow-cyan), var(--edge-highlight), var(--lift)',
                                              borderColor: 'var(--color-cyan)',
                                          }
                                        : undefined
                                }
                            >
                                <div className="flex w-full items-center justify-between gap-2">
                                    <span className="font-mono text-sm text-tx">
                                        {slot.day} · {slot.time}
                                    </span>
                                    {slot.profileHint && (
                                        <span
                                            className="inline-block h-2 w-2 shrink-0 rounded-full"
                                            style={{
                                                backgroundColor: profileColor[slot.profileHint],
                                                boxShadow: profileGlow[slot.profileHint],
                                            }}
                                            aria-label={`профиль ${slot.profileHint}`}
                                        />
                                    )}
                                </div>
                                <span className="text-xs text-tx3">{slot.label}</span>
                                {typeof slot.walkMinutes === 'number' && (
                                    <span className="font-mono text-[11px] text-tx3">
                                        ~{slot.walkMinutes} мин пешком
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex flex-col items-stretch gap-3">
                    {selected && tgHref ? (
                        <a
                            data-testid="booking-cta"
                            href={tgHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleTake}
                            className="btn btn-slot w-full"
                        >
                            {ctaLabel} {selected.day} · {selected.time} →
                        </a>
                    ) : (
                        <button
                            data-testid="booking-cta"
                            type="button"
                            aria-disabled="true"
                            className="btn btn-slot w-full"
                        >
                            {ctaLabel} →
                        </button>
                    )}
                    <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-tx3">
                        {honestyNote}
                    </p>
                </div>
            </div>
        </section>
    );
}

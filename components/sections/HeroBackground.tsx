'use client';

import {useEffect, useRef} from 'react';
import type {CSSProperties} from 'react';

/**
 * HeroBackground (SPEC v3.3 §5.9)
 * Два слоя: статичная сетка-клетка (.hero-grid) + cyan-сетка под маской-пятном (.hero-glow).
 * Пятно следует за курсором через CSS-vars --mx/--my (без setState, без reflow).
 * Только десктоп: на touch и при reduced-motion слой glow скрыт CSS-медиа.
 */
export function HeroBackground() {
    const glowRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const supportsHover = window.matchMedia?.('(hover: hover)').matches ?? false;
        if (!supportsHover) return;

        const glow = glowRef.current;
        const hero = glow?.closest('.hero') as HTMLElement | null;
        if (!glow || !hero) return;

        const onMove = (e: PointerEvent) => {
            const r = hero.getBoundingClientRect();
            glow.style.setProperty('--mx', `${e.clientX - r.left}px`);
            glow.style.setProperty('--my', `${e.clientY - r.top}px`);
        };

        hero.addEventListener('pointermove', onMove);
        return () => hero.removeEventListener('pointermove', onMove);
    }, []);

    return (
        <>
            <div className="hero-grid" aria-hidden="true"/>
            <div
                ref={glowRef}
                className="hero-glow"
                aria-hidden="true"
                style={{'--mx': '50%', '--my': '50%'} as CSSProperties}
            />
        </>
    );
}

'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';

/**
 * v3.1 §5.6: появление по IntersectionObserver — добавляет класс .in.
 * CSS-класс .reveal / .reveal.in лежит в globals.css.
 * prefers-reduced-motion отключает анимацию через медиа-запрос там же.
 */
export function Reveal({
                           children,
                           className = '',
                           delayMs = 0,
                       }: {
    children: ReactNode;
    className?: string;
    delayMs?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(() =>
        typeof window !== 'undefined'
            ? (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)
            : false,
    );

    useEffect(() => {
        if (visible) return;
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) {
                    if (e.isIntersecting) {
                        setVisible(true);
                        io.disconnect();
                        break;
                    }
                }
            },
            {rootMargin: '0px 0px -10% 0px', threshold: 0.12},
        );
        io.observe(el);
        return () => io.disconnect();
        // visible намеренно не в deps: observer создаётся один раз
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal${visible ? ' in' : ''} ${className}`}
            style={{transitionDelay: visible && delayMs ? `${delayMs}ms` : undefined}}
        >
            {children}
        </div>
    );
}

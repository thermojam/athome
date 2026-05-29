'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';

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
            : false
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
            {rootMargin: '0px 0px -10% 0px', threshold: 0.1},
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            data-reveal={visible ? 'visible' : 'hidden'}
            style={{transitionDelay: visible ? `${delayMs}ms` : '0ms'}}
            className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${className}`}
        >
            {children}
        </div>
    );
}

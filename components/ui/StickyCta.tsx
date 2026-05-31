'use client';

import {useEffect, useState} from 'react';
import {CONTENT} from '@/lib/quiz-data';

/**
 * Sticky-CTA внизу экрана на мобилке: появляется после небольшого
 * скролла, ведёт к якорю #test (квиз). SPEC §13.
 */
export function StickyCta() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 240);
        onScroll();
        window.addEventListener('scroll', onScroll, {passive: true});
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div
            className={`pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 transition-opacity duration-200 md:hidden ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!visible}
        >
            <a
                href="#test"
                className="btn btn-primary pointer-events-auto w-full max-w-md"
            >
                {CONTENT.stickyCta}
            </a>
        </div>
    );
}

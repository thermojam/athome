'use client';

import type {ReactNode} from 'react';
import type {Goal} from '@/lib/types';
import {reachGoal} from '@/lib/analytics';

export function TrackedLink({
                                href,
                                goal,
                                children,
                                className = '',
                                external = false,
                            }: {
    href: string;
    goal: Goal;
    children: ReactNode;
    className?: string;
    external?: boolean;
}) {
    return (
        <a
            href={href}
            className={className}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            onClick={() => reachGoal(goal)}
        >
            {children}
        </a>
    );
}

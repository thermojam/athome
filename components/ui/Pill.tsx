import type {ReactNode} from 'react';

/**
 * Премиум-пилюля — обёртка над .pill из @layer components (globals.css).
 * Используется в Hero (метки тренера), BookingSlot (тег «зал у дома»),
 * списках точек ЖК и пр.
 */
export function Pill({children}: { children: ReactNode }) {
    return <span className="pill">{children}</span>;
}

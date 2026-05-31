import {CONTENT} from '@/lib/quiz-data';
import type {MapPoint} from '@/lib/types';

/**
 * Премиум-карта района (SPEC §8). Server Component.
 * 3 колонки на десктопе, стек на мобиле.
 * Центр — стеклянная квадратная карта с SVG-подложкой и CSS-радаром.
 */
export function LocationMap() {
    const {kicker, h2, body, gymLabel, points} = CONTENT.map;

    return (
        <section
            id="map"
            className="relative mx-auto w-full max-w-6xl px-4 py-20 md:py-28"
        >
            <div className="grid gap-10 md:grid-cols-[1fr_minmax(360px,460px)_1fr] md:items-center md:gap-12">
                {/* ── Левая колонка ── */}
                <div className="flex flex-col gap-4">
                    <span className="kicker">◆ {kicker}</span>
                    <h2 className="font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                        {h2}
                    </h2>
                    <p className="max-w-md text-base text-tx2">{body}</p>
                </div>

                {/* ── Центр: квадратная карта ── */}
                <div className="card aspect-square w-full p-4 md:p-6">
                    <MapSvg points={points} gymLabel={gymLabel}/>
                </div>

                {/* ── Правая колонка: список ЖК ── */}
                <ul className="flex flex-col gap-3">
                    {points.map((p) => (
                        <li
                            key={p.name}
                            className="card-sm hairline flex items-center gap-3"
                            style={{borderRadius: 'var(--radius-md)'}}
                        >
                            <span
                                className="inline-block h-3 w-3 shrink-0 rounded-full"
                                style={{
                                    backgroundColor: `var(${p.accentVar})`,
                                    boxShadow: glowForAccent(p.accentVar),
                                }}
                                aria-hidden
                            />
                            <span className="flex-1 text-sm text-tx">{p.name}</span>
                            <span className="font-mono text-xs text-tx3">~{p.walkMinutes} мин</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

function MapSvg({points, gymLabel}: { points: MapPoint[]; gymLabel: string }) {
    return (
        <div className="relative h-full w-full">
            <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full"
                aria-label="Схема расположения зала и ближайших ЖК"
            >
                {/* Сетка улиц (приглушённая) */}
                {Array.from({length: 9}).map((_, i) => (
                    <line
                        key={`h-${i}`}
                        x1={0}
                        y1={(i + 1) * 10}
                        x2={100}
                        y2={(i + 1) * 10}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth={0.4}
                    />
                ))}
                {Array.from({length: 9}).map((_, i) => (
                    <line
                        key={`v-${i}`}
                        x1={(i + 1) * 10}
                        y1={0}
                        x2={(i + 1) * 10}
                        y2={100}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth={0.4}
                    />
                ))}
                {/* Диагональный «проспект» */}
                <line
                    x1={5}
                    y1={95}
                    x2={95}
                    y2={5}
                    stroke="rgba(139,92,255,0.18)"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                />

                {/* Радар: 3 кольца с задержкой */}
                <circle cx={50} cy={50} r={10} fill="none" stroke="rgba(44,230,255,0.5)" strokeWidth={0.6}
                        className="radar-ring radar-ring--d1"/>
                <circle cx={50} cy={50} r={10} fill="none" stroke="rgba(139,92,255,0.4)" strokeWidth={0.6}
                        className="radar-ring radar-ring--d2"/>
                <circle cx={50} cy={50} r={10} fill="none" stroke="rgba(255,79,216,0.3)" strokeWidth={0.6}
                        className="radar-ring radar-ring--d3"/>

                {/* Пины ЖК */}
                {points.map((p) => (
                    <g key={p.name}>
                        <circle
                            cx={p.x}
                            cy={p.y}
                            r={2.6}
                            fill={`var(${p.accentVar})`}
                            style={{filter: `drop-shadow(0 0 4px ${rgbaForAccent(p.accentVar, 0.85)})`}}
                        />
                    </g>
                ))}

                {/* Центр: бейдж-зал */}
                <g>
                    <circle
                        cx={50}
                        cy={50}
                        r={6}
                        fill="url(#gymGradient)"
                        style={{filter: 'drop-shadow(0 0 8px rgba(44,230,255,0.7))'}}
                    />
                    <text
                        x={50}
                        y={51.5}
                        textAnchor="middle"
                        fontSize={4}
                        fontWeight={700}
                        fill="#06121b"
                        fontFamily="var(--font-display), Georgia, serif"
                    >
                        K
                    </text>
                </g>

                <defs>
                    <linearGradient id="gymGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8B5CFF"/>
                        <stop offset="100%" stopColor="#2CE6FF"/>
                    </linearGradient>
                </defs>
            </svg>

            {/* Подпись зала под SVG */}
            <p
                className="absolute inset-x-0 bottom-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-tx3 md:text-xs"
                aria-hidden
            >
                {gymLabel}
            </p>
        </div>
    );
}

function glowForAccent(v: MapPoint['accentVar']): string {
    switch (v) {
        case '--color-cyan':
            return 'var(--glow-cyan)';
        case '--color-violet':
            return 'var(--glow-violet)';
        case '--color-green':
            return 'var(--glow-green)';
        case '--color-pink':
            return 'var(--glow-pink)';
    }
}

function rgbaForAccent(v: MapPoint['accentVar'], a: number): string {
    switch (v) {
        case '--color-cyan':
            return `rgba(44,230,255,${a})`;
        case '--color-violet':
            return `rgba(139,92,255,${a})`;
        case '--color-green':
            return `rgba(54,255,157,${a})`;
        case '--color-pink':
            return `rgba(255,79,216,${a})`;
    }
}

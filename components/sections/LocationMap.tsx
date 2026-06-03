import {CONTENT} from '@/lib/quiz-data';

/**
 * LocationMap (SPEC v3.3 §8) — карта локации, ПУТЬ A: без .card на секции.
 * Серверный компонент: SVG + пульсирующий радар CSS-анимацией.
 */
export function LocationMap() {
    const {kicker, h2, body, gymLabel, caption, points} = CONTENT.map;

    return (
        <section id="map" className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28">
            <div className="loc loc-full">
                <div className="loc-intro">
                    <span className="kicker">{kicker}</span>
                    <h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">{h2}</h2>
                    <p className="mt-4 text-base text-tx2">{body}</p>
                </div>

                <div className="map-box">
                    <svg viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <defs>
                            <linearGradient id="gymgrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#8B5CFF"/>
                                <stop offset="1" stopColor="#2CE6FF"/>
                            </linearGradient>
                        </defs>
                        {/* сетка улиц */}
                        <line className="map-gl" x1="0" y1="36" x2="320" y2="36"/>
                        <line className="map-gl major" x1="0" y1="74" x2="320" y2="74"/>
                        <line className="map-gl" x1="0" y1="112" x2="320" y2="112"/>
                        <line className="map-gl major" x1="0" y1="150" x2="320" y2="150"/>
                        <line className="map-gl" x1="0" y1="188" x2="320" y2="188"/>
                        <line className="map-gl" x1="48" y1="0" x2="48" y2="220"/>
                        <line className="map-gl major" x1="104" y1="0" x2="104" y2="220"/>
                        <line className="map-gl" x1="160" y1="0" x2="160" y2="220"/>
                        <line className="map-gl major" x1="216" y1="0" x2="216" y2="220"/>
                        <line className="map-gl" x1="272" y1="0" x2="272" y2="220"/>
                        {/* диагональ-проспект */}
                        <line className="map-gl major" x1="0" y1="210" x2="320" y2="20"/>
                        {/* залив снизу */}
                        <path d="M0 165 Q80 155 160 165 Q240 175 320 162 L320 220 L0 220 Z" fill="rgba(40,90,140,0.18)"/>
                        <path d="M0 165 Q80 155 160 165 Q240 175 320 162" fill="none" stroke="rgba(44,230,255,0.4)" strokeWidth="1.5"/>
                        {/* радар */}
                        <g className="radar-soft">
                            <circle className="radar-static r3" cx="160" cy="92" r="62"/>
                            <circle className="radar-static r2" cx="160" cy="92" r="42"/>
                        </g>
                        {/* центр-зал */}
                        <circle cx="160" cy="92" r="22" fill="url(#gymgrad)" stroke="rgba(44,230,255,0.7)" strokeWidth="1.5" style={{filter: 'drop-shadow(0 0 16px rgba(44,230,255,0.6))'}}/>
                        <text x="160" y="93" textAnchor="middle" dominantBaseline="central" fontFamily="Georgia,serif" fontWeight="700" fontSize="16" fill="#0a0f1a">НК</text>
                    </svg>
                    {/* пины */}
                    {points.map((p, i) => {
                        const fill =
                            p.accentVar === '--color-orange' ? '#FF9F43'
                            : p.accentVar === '--color-cyan' ? '#2CE6FF'
                            : p.accentVar === '--color-violet' ? '#8B5CFF'
                            : p.accentVar === '--color-green' ? '#36FF9D'
                            : '#FF4FD8';
                        return (
                            <div
                                key={p.name}
                                className={`pin pin-${i + 1}`}
                                style={{top: `${p.y}%`, left: `${p.x}%`}}
                            >
                                <svg viewBox="0 0 24 31" aria-hidden="true">
                                    <path d="M12 0C5.4 0 0 5 0 11.3 0 20 12 31 12 31s12-11 12-19.7C24 5 18.6 0 12 0z" fill={fill}/>
                                    <circle cx="12" cy="11" r="4.4" fill="#0a0f1a"/>
                                </svg>
                            </div>
                        );
                    })}
                    <div className="gym-core">
                        <div className="gym-cap">{gymLabel}</div>
                    </div>
                </div>

                <div className="zk-list">
                    {points.map((p) => (
                        <div className="zk" key={p.name}>
                            <span
                                className="tick"
                                style={{
                                    background: `var(${p.accentVar})`,
                                    boxShadow: `var(--glow-${p.accentVar.replace('--color-', '')})`,
                                }}
                            />
                            <span className="time">~{p.walkMinutes} мин</span>
                            <span className="name">{p.name}</span>
                        </div>
                    ))}
                </div>
            </div>
            <p className="loc-cap">{caption}</p>
        </section>
    );
}
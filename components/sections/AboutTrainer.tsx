import {CONTENT, DIRECT_TG_MESSAGE} from '@/lib/quiz-data';
import {buildTelegramLink} from '@/lib/telegram';
import {TrackedLink} from '@/components/ui/TrackedLink';

/**
 * AboutTrainer (SPEC v3.3 §8.6) — знакомство наверху страницы.
 * Зона рассказа: без .card на секции; рамка только у фото.
 *
 * Фото-фоллбэк: пока в public/about-photo.jpg нет реального фото,
 * рендерим градиент-плейсхолдер. Переключение на <Image> — отдельный мелкий PR
 * после получения снимка от заказчика.
 */
export function AboutTrainer() {
    const {kicker, h2, intro, facts, freeMeetingNote, cta1, cta2, microcopy, badge} = CONTENT.about;
    const tgHref = buildTelegramLink(DIRECT_TG_MESSAGE);

    return (
        <section id="about" className="mx-auto w-full max-w-[var(--container)] px-4 py-20 md:py-28">
            <div className="about">
                <div className="about-photo about-photo-placeholder">
                    <span className="badge">{badge}</span>
                </div>
                <div>
                    <span className="kicker">{kicker}</span>
                    <h2 className="mt-3 font-display text-3xl uppercase tracking-tight text-tx md:text-4xl">
                        {h2}
                    </h2>
                    <p className="mt-4 text-base text-tx2 md:text-[17px]">{intro}</p>

                    <div className="about-facts">
                        {facts.map((f) => (
                            <div className="about-fact" key={f.num}>
                                <span className="num">{f.num}</span>
                                <span className="txt">{f.txt}</span>
                            </div>
                        ))}
                    </div>

                    <p className="mb-5 text-base text-tx2">{freeMeetingNote}</p>

                    <div className="about-cta">
                        <a href="#test" className="btn btn-lg btn-primary">{cta1}</a>
                        <TrackedLink
                            href={tgHref}
                            goal="lead_click_direct"
                            external
                            className="btn btn-lg btn-secondary"
                        >
                            {cta2}
                        </TrackedLink>
                    </div>

                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-tx3">
                        {microcopy}
                    </p>
                </div>
            </div>
        </section>
    );
}
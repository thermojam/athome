'use client';

type CookieBannerProps = {
    onAccept: () => void;
    onDecline: () => void;
};

export function CookieBanner({onAccept, onDecline}: CookieBannerProps): React.ReactNode {
    return (
        <section
            className="cookie-consent-banner"
            role="region"
            aria-labelledby="cookie-consent-title"
            aria-describedby="cookie-consent-description"
        >
            <div className="cookie-consent-inner">
                <div className="cookie-consent-copy">
                    <h2 id="cookie-consent-title" className="font-display text-xl text-tx">
                        Cookies и аналитика
                    </h2>
                    <p
                        id="cookie-consent-description"
                        className="mt-2 text-sm leading-relaxed text-tx2"
                    >
                        Используем cookies и Яндекс.Метрику для обезличенной статистики и улучшения страницы.
                    </p>
                    <p className="cookie-consent-links mt-3 text-xs text-tx3">
                        <a href="/cookies/" className="underline hover:text-tx2">Политика cookies</a>
                        {' · '}
                        <a href="/privacy/" className="underline hover:text-tx2">
                            Политика конфиденциальности
                        </a>
                    </p>
                </div>

                <div className="cookie-consent-actions">
                    <button
                        type="button"
                        className="btn btn-md btn-secondary flex-1"
                        onClick={onDecline}
                    >
                        Отказаться
                    </button>
                    <button
                        type="button"
                        className="btn btn-md btn-secondary cookie-consent-accept flex-1"
                        onClick={onAccept}
                    >
                        Принять
                    </button>
                </div>
            </div>
        </section>
    );
}

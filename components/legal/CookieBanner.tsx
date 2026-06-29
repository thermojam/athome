export function CookieBanner({
    onAccept,
    onDecline,
}: {
    onAccept: () => void;
    onDecline: () => void;
}): React.ReactNode {
    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
            <section
                className="card mx-auto max-w-3xl"
                role="region"
                aria-label="Согласие на cookies"
            >
                <p className="text-sm leading-relaxed text-tx2">
                    Сайт использует Яндекс.Метрику и Вебвизор для анализа посещаемости и улучшения страницы.
                    Аналитика включается только с вашего согласия.
                </p>
                <p className="mt-2 text-xs text-tx3">
                    <a href="/cookies/" className="underline hover:text-tx2">Политика cookies</a>
                    {' · '}
                    <a href="/privacy/" className="underline hover:text-tx2">Политика конфиденциальности</a>
                </p>
                <div className="mt-4 flex gap-3">
                    <button type="button" className="btn btn-md btn-secondary flex-1" onClick={onDecline}>
                        Отказаться
                    </button>
                    <button type="button" className="btn btn-md btn-primary flex-1" onClick={onAccept}>
                        Принять
                    </button>
                </div>
            </section>
        </div>
    );
}

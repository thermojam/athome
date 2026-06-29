'use client';

import {useEffect, useRef} from 'react';

type CookieBannerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAccept: () => void;
    onDecline: () => void;
};

export function CookieBanner({
    open,
    onOpenChange,
    onAccept,
    onDecline,
}: CookieBannerProps): React.ReactNode {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    function dismiss() {
        dialogRef.current?.close();
    }

    function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
        event.preventDefault();
        event.currentTarget.close();
    }

    return (
        <>
            <button
                type="button"
                className="cookie-consent-capsule"
                aria-haspopup="dialog"
                aria-controls="cookie-consent-dialog"
                onClick={() => onOpenChange(true)}
            >
                <span className="h-2 w-2 shrink-0 rounded-full bg-violet" aria-hidden="true"/>
                <span>Cookies выключены · Настроить</span>
            </button>

            <dialog
                ref={dialogRef}
                id="cookie-consent-dialog"
                className="cookie-consent-dialog"
                aria-labelledby="cookie-consent-title"
                aria-describedby="cookie-consent-description"
                onClose={() => onOpenChange(false)}
                onCancel={handleCancel}
            >
                <section className="cookie-consent-panel">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="cookie-consent-title" className="font-display text-xl text-tx">
                                Настройки cookies
                            </h2>
                            <p id="cookie-consent-description" className="mt-2 text-sm leading-relaxed text-tx2">
                                Яндекс.Метрика и Вебвизор выключены. Разрешите аналитику, чтобы помочь улучшать страницу.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="cookie-consent-close"
                            aria-label="Закрыть настройки cookies"
                            onClick={dismiss}
                        >
                            ×
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-tx3">
                        <a href="/cookies/" className="underline hover:text-tx2">Политика cookies</a>
                        {' · '}
                        <a href="/privacy/" className="underline hover:text-tx2">Политика конфиденциальности</a>
                    </p>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button type="button" className="btn btn-md btn-secondary flex-1" onClick={onDecline}>
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
                </section>
            </dialog>
        </>
    );
}

import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Политика cookies · Тренер у дома',
    description: 'Как сайт использует cookies, localStorage, Яндекс.Метрику и Вебвизор.',
    robots: {index: false, follow: true},
};

export default function CookiesPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-20 text-tx">
            <h1 className="font-display text-3xl md:text-4xl">Политика cookies</h1>
            <p className="mt-4 text-sm text-tx3">Редакция от 29 июня 2026 г.</p>

            <section className="mt-10 space-y-4 text-tx2">
                <h2 className="font-display text-xl text-tx">1. Что такое cookies и localStorage</h2>
                <p>
                    Cookies — небольшие файлы, которые сайт и подключённые сервисы сохраняют в браузере.
                    localStorage — хранилище браузера, в котором данные остаются между посещениями сайта.
                </p>

                <h2 className="font-display text-xl text-tx">2. Какие технологии используются</h2>
                <p>
                    Сайт сохраняет в localStorage решение посетителя об аналитике. После согласия Яндекс.Метрика
                    может использовать _ym_uid, _ym_d, _ym_isad, _ym_visorc_*, а также localStorage-свойства
                    Метрики. Актуальный перечень и сроки хранения публикует Яндекс.
                </p>

                <h2 className="font-display text-xl text-tx">3. Яндекс.Метрика и Вебвизор</h2>
                <p>
                    Яндекс.Метрика и Вебвизор помогают оценивать посещаемость, источники переходов и
                    взаимодействия со страницей, чтобы улучшать её содержание и удобство.
                </p>

                <h2 className="font-display text-xl text-tx">4. Согласие и отказ</h2>
                <p>Аналитика включается только после явного согласия посетителя.</p>
                <p>
                    При отказе Метрика не загружается, а функциональность Сайта сохраняется: квиз, выбор слота
                    и переходы в Telegram продолжают работать.
                </p>

                <h2 className="font-display text-xl text-tx">5. Как изменить решение</h2>
                <p>
                    Решение можно изменить кнопкой «Настройки cookies» в футере. Сайт хранит решение 365 дней;
                    сроки хранения файлов Яндекса определяются Яндексом.
                </p>

                <h2 className="font-display text-xl text-tx">6. Документы Яндекса</h2>
                <p>
                    Яндекс публикует
                    {' '}<a
                        className="underline hover:text-tx"
                        href="https://yandex.ru/support/metrica/ru/general/cookie-usage"
                        target="_blank"
                        rel="noopener noreferrer"
                    >перечень cookies Яндекс.Метрики</a>
                    {' '}и
                    {' '}<a
                        className="underline hover:text-tx"
                        href="https://yandex.ru/legal/metrica_termsofuse/ru/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >условия использования Яндекс.Метрики</a>.
                </p>

                <h2 className="font-display text-xl text-tx">7. Изменения политики</h2>
                <p>
                    Актуальная редакция всегда доступна по адресу
                    {' '}<code className="font-mono text-tx">/cookies/</code>.
                </p>
            </section>

            <p className="mt-12">
                <Link href="/" className="text-sm text-tx2 underline hover:text-tx">← На главную</Link>
            </p>
        </main>
    );
}

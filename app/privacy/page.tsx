import type {Metadata} from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Политика конфиденциальности · Тренер у дома',
    description: 'Как обрабатываются персональные данные посетителей сайта.',
    robots: {index: false, follow: true},
};

export default function PrivacyPage() {
    return (
        <main className="mx-auto max-w-3xl px-4 py-20 text-tx">
            <h1 className="font-display text-3xl md:text-4xl">Политика конфиденциальности</h1>
            <p className="mt-4 text-sm text-tx3">Редакция от 12 августа 2026 г.</p>

            <section className="mt-10 space-y-4 text-tx2">
                <h2 className="font-display text-xl text-tx">1. Кто обрабатывает данные</h2>
                <p>
                    Сайт «Тренер у дома» (далее — «Сайт») оператор персональных данных: Каменский Никита,
                    физическое лицо, применяющее налог на профессиональный доход (НПД), ИНН 781433506053.
                    Сайт: <a className="underline hover:text-tx" href="https://trenerprimorskiy.ru/"
                             target="_blank" rel="noopener noreferrer">trenerprimorskiy.ru</a>.
                    Контакт для обращений: <a className="underline hover:text-tx" href="https://t.me/Nikita_Mensky"
                                               target="_blank" rel="noopener noreferrer">@Nikita_Mensky</a>.
                </p>

                <h2 className="font-display text-xl text-tx">2. Какие данные собираются</h2>
                <p>
                    На Сайте нет форм регистрации и полей для ввода персональных данных. Ответы и результат
                    квиза формируются только в браузере посетителя и не передаются Оператору через Сайт.
                    При самостоятельном переходе пользователя в Telegram и отправке сообщения Оператор получает
                    данные, которые пользователь указал в переписке: имя, username, содержание сообщения и иные
                    сведения, сообщённые по собственной инициативе.
                </p>
                <p>
                    После согласия посетителя на Сайте запускается Яндекс.Метрика. Она может обрабатывать
                    техническую информацию о посещении: IP-адрес, тип браузера и операционной системы,
                    источник перехода, действия на странице, продолжительность сессии, идентификаторы cookies
                    и данные Вебвизора. Использование этих данных регулируется
                    {' '}<a className="underline hover:text-tx" href="https://yandex.ru/legal/metrica_termsofuse/"
                            target="_blank" rel="noopener noreferrer">условиями Яндекс.Метрики</a>.
                </p>

                <h2 className="font-display text-xl text-tx">3. Зачем данные обрабатываются</h2>
                <p>
                    Цели обработки: работа квиза без передачи его результата Оператору; ответ на обращение,
                    запись на встречу и согласование деталей в Telegram; оценка посещаемости и улучшение Сайта
                    с помощью Яндекс.Метрики.
                </p>
                <p>
                    Основанием для аналитики является согласие посетителя. Обработка обращения в Telegram
                    осуществляется по инициативе пользователя для ответа на обращение и согласования встречи.
                    Данные передаются Яндекс.Метрике и Telegram в объёме, необходимом для их работы и выбранного
                    пользователем взаимодействия.
                </p>

                <h2 className="font-display text-xl text-tx">4. Cookies</h2>
                <p>
                    Аналитические cookies и Яндекс.Метрика используются только после согласия посетителя.
                    Отказ не влияет на работу квиза, выбор слота и переходы в Telegram. Подробности доступны в
                    {' '}<a href="/cookies/" className="underline hover:text-tx">Политике cookies</a>.
                </p>

                <h2 className="font-display text-xl text-tx">5. Сроки хранения и уничтожение</h2>
                <p>
                    Ответы и результат квиза не сохраняются на сервере Сайта. Решение о согласии на аналитику
                    хранится в localStorage браузера 365 дней. Сроки хранения данных Яндекс.Метрики определяются
                    Яндексом. Переписка в Telegram хранится в соответствии с правилами Telegram и до достижения
                    цели общения, если более длительный срок не требуется законом.
                </p>

                <h2 className="font-display text-xl text-tx">6. Права пользователя</h2>
                <p>
                    Пользователь вправе запросить информацию об обработке своих данных, потребовать их уточнения
                    или удаления, а также отозвать согласие на аналитику. Для обращения используйте Telegram
                    <a className="underline hover:text-tx" href="https://t.me/Nikita_Mensky" target="_blank"
                       rel="noopener noreferrer"> @Nikita_Mensky</a>.
                </p>

                <h2 className="font-display text-xl text-tx">7. Защита данных</h2>
                <p>
                    Оператор принимает необходимые правовые, организационные и технические меры для защиты
                    персональных данных от неправомерного или случайного доступа, уничтожения, изменения,
                    блокирования, копирования и распространения.
                </p>

                <h2 className="font-display text-xl text-tx">8. Изменения политики</h2>
                <p>
                    Актуальная редакция всегда доступна по адресу
                    {' '}<code className="font-mono text-tx">/privacy/</code>. О существенных изменениях посетители
                    уведомляются на Сайте.
                </p>
            </section>

            <p className="mt-12">
                <Link href="/" className="text-sm text-tx2 underline hover:text-tx">← На главную</Link>
            </p>
        </main>
    );
}

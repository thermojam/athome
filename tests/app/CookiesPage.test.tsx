import {describe, expect, it} from 'vitest';
import {render, screen} from '@testing-library/react';
import CookiesPage, {metadata} from '@/app/cookies/page';
import PrivacyPage from '@/app/privacy/page';

describe('CookiesPage', () => {
    it('has noindex metadata', () => {
        expect(metadata.title).toBe('Политика cookies · Тренер у дома');
        expect(metadata.robots).toEqual({index: false, follow: true});
    });

    it('describes consent, analytics technologies, and refusal', () => {
        render(<CookiesPage/>);

        expect(screen.getByRole('heading', {level: 1, name: 'Политика cookies'})).toBeInTheDocument();
        expect(screen.getByText('Редакция от 29 июня 2026 г.')).toBeInTheDocument();
        expect(screen.getAllByText(/localStorage/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Яндекс.Метрик/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Вебвизор/).length).toBeGreaterThan(0);
        expect(screen.getByText(/только после явного согласия посетителя/)).toBeInTheDocument();
        expect(screen.getByText(/Метрика не загружается, а функциональность Сайта сохраняется/)).toBeInTheDocument();
        expect(screen.getByText(/365 дней/)).toBeInTheDocument();
    });

    it('links to Yandex documentation and back to the home page', () => {
        render(<CookiesPage/>);

        expect(screen.getByRole('link', {name: 'перечень cookies Яндекс.Метрики'})).toHaveAttribute(
            'href',
            'https://yandex.ru/support/metrica/ru/general/cookie-usage',
        );
        expect(screen.getByRole('link', {name: 'условия использования Яндекс.Метрики'})).toHaveAttribute(
            'href',
            'https://yandex.ru/legal/metrica_termsofuse/ru/',
        );
        expect(screen.getByRole('link', {name: '← На главную'})).toHaveAttribute('href', '/');
    });
});

describe('PrivacyPage cookie disclosure', () => {
    it('states that analytics requires consent and links to the cookie policy', () => {
        render(<PrivacyPage/>);

        expect(screen.getByText('Редакция от 29 июня 2026 г.')).toBeInTheDocument();
        expect(screen.getByText(/Аналитические cookies и Яндекс.Метрика используются только после согласия/))
            .toBeInTheDocument();
        expect(screen.getByText(/Отказ не влияет на работу квиза, выбор слота и переходы в Telegram/))
            .toBeInTheDocument();
        expect(screen.getByRole('link', {name: 'Политике cookies'})).toHaveAttribute('href', '/cookies/');
        expect(screen.queryByText(/cookies, необходимые для работы Яндекс.Метрики/)).not.toBeInTheDocument();
    });
});
